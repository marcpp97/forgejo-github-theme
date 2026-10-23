import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const script = readFileSync(new URL("./work.js", import.meta.url), "utf8");

type Fake = {
  tag: string;
  className: string;
  textContent: string;
  title: string;
  href: string;
  hidden: boolean;
  children: (Fake | string)[];
  classList: { add: (...names: string[]) => void };
  append: (...nodes: (Fake | string)[]) => void;
  replaceChildren: (...nodes: Fake[]) => void;
  cloneNode: () => Fake;
};

function element(tag = "div"): Fake {
  const node: Fake = {
    tag,
    className: "",
    textContent: "",
    title: "",
    href: "",
    hidden: false,
    children: [],
    classList: { add: (...names) => (node.className = [node.className, ...names].join(" ").trim()) },
    append: (...nodes) => node.children.push(...nodes),
    replaceChildren: (...nodes) => (node.children = nodes),
    cloneNode: () => element("svg"),
  };
  return node;
}

function panel(kind: string, query?: string) {
  const rows = element("ul");
  const count = element("span");
  return {
    rows,
    count,
    hidden: true,
    dataset: { themeWorkPanel: kind, ...(query ? { query } : {}) },
    querySelector: (selector: string) =>
      ({ "[data-theme-work-rows]": rows, "[data-theme-work-count]": count })[selector],
  };
}

function fixture(responses: Record<string, unknown[]>, owner?: string) {
  const assigned = panel("search", "type=issues&assigned=true");
  const reviews = panel("search", "type=pulls&review_requested=true");
  const releases = panel("releases");
  const rail = {
    hidden: true,
    dataset: { search: "/issues/search", ...(owner ? { owner } : {}) },
    querySelector: () => ({ content: { querySelector: () => element("svg") } }),
    querySelectorAll: () => [assigned, reviews, releases],
  };
  const fetch = vi.fn(async (url: string) => {
    const params = new URL(url, "http://forgejo").searchParams;
    const key = params.has("assigned") ? "assigned" : "reviews";
    const body = responses[key] ?? [];
    return { ok: true, json: async () => body, headers: { get: () => String(body.length) } };
  });
  const document = {
    documentElement: { lang: "en-US" },
    querySelectorAll: (selector: string) => (selector === "[data-theme-work]" ? [rail] : []),
    createElement: (tag: string) => element(tag),
  };
  runInNewContext(script, {
    document,
    fetch,
    location: { origin: "http://forgejo" },
    Intl,
    URL,
    URLSearchParams,
    Date,
    Number,
    String,
    Array,
    Set,
    Promise,
  });
  return { rail, assigned, reviews, releases, fetch, settle: () => new Promise(resolve => setTimeout(resolve, 0)) };
}

const issue = {
  number: 5,
  title: "Remove the legacy `/v0` endpoints",
  html_url: "http://forgejo/acme/webapp/issues/5",
  updated_at: new Date().toISOString(),
  repository: { full_name: "acme/webapp" },
};

describe("Home's work rail", () => {
  it("asks Forgejo's issue search for open work, a few rows at a time, scoped to an organization", async () => {
    const f = fixture({}, "acme");
    await f.settle();
    const params = new URL(f.fetch.mock.calls[0][0], "http://forgejo").searchParams;
    expect(Object.fromEntries(params)).toMatchObject({
      type: "issues",
      assigned: "true",
      state: "open",
      limit: "3",
      owner: "acme",
    });
  });

  it("shows only the boxes with something in them, and stays hidden when all are empty", async () => {
    const empty = fixture({});
    await empty.settle();
    expect(empty.rail.hidden).toBe(true);
    expect(empty.assigned.hidden).toBe(true);

    const f = fixture({ assigned: [issue] });
    await f.settle();
    expect(f.rail.hidden).toBe(false);
    expect(f.assigned.hidden).toBe(false);
    expect(f.reviews.hidden).toBe(true);
    expect(f.releases.hidden).toBe(true);
    expect(f.assigned.count.textContent).toBe("1");
  });

  it("renders a title's inline code and links only within the site", async () => {
    const f = fixture({ assigned: [issue, { ...issue, number: 6, html_url: "https://evil.example/x" }] });
    await f.settle();
    const [first, second] = f.assigned.rows.children as Fake[];
    const link = (first.children[1] as Fake).children[0] as Fake;
    expect(link.href).toBe("/acme/webapp/issues/5");
    expect(link.children[0]).toBe("Remove the legacy ");
    expect((link.children[1] as Fake).tag).toBe("code");
    expect((link.children[1] as Fake).textContent).toBe("/v0");
    expect(((second.children[1] as Fake).children[0] as Fake).href).toBe("#");
    expect(((first.children[1] as Fake).children[1] as Fake).textContent).toMatch(/^acme\/webapp#5 · /);
  });
});
