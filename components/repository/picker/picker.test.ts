import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const script = readFileSync(new URL("./picker.js", import.meta.url), "utf8");

type Listener = (event: Record<string, unknown>) => void;
type Fake = {
  tag: string;
  className: string;
  textContent: string;
  title: string;
  href: string;
  hidden: boolean;
  attributes: Map<string, string>;
  children: Fake[];
  classList: { add: (name: string) => void };
  setAttribute: (name: string, value: string) => void;
  removeAttribute: (name: string) => void;
  append: (...nodes: Fake[]) => void;
  replaceChildren: () => void;
  querySelector: (selector: string) => Fake | undefined;
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
    attributes: new Map(),
    children: [],
    classList: { add: name => (node.className = `${node.className} ${name}`.trim()) },
    setAttribute: (name, value) => node.attributes.set(name, value),
    removeAttribute: name => node.attributes.delete(name),
    append: (...nodes) => node.children.push(...nodes),
    replaceChildren: () => (node.children = []),
    querySelector: selector =>
      selector === "a.theme-repo-picker-item" ? node.children[0]?.children[0] : node.children[0],
    cloneNode: () => element("svg"),
  };
  return node;
}

function fixture(dataset: Record<string, string>, pages: unknown[][], total = 2, ok = true) {
  const listeners = new Map<string, Listener>();
  const docListeners = new Map<string, Listener>();
  const list = element("ul");
  const message = element("p");
  message.hidden = true;
  const more = element("button");
  more.hidden = true;
  const query = {
    ...element("input"),
    value: "",
    focus: vi.fn(),
    closest: () => field,
    addEventListener: (name: string, fn: Listener) => listeners.set(name, fn),
  };
  const field = { hidden: true };
  const moreButton = { ...more, addEventListener: (name: string, fn: Listener) => listeners.set(`more:${name}`, fn) };
  const icons = { content: { querySelector: () => element("svg") } };
  const text = { dataset: { empty: "No results", error: "Could not load" } };
  const picker = {
    dataset: { url: "/repo/search", uid: "7", limit: "2", ...dataset },
    querySelector: (selector: string) =>
      ({
        "[data-theme-repo-picker-list]": list,
        ".theme-repo-picker-search input": query,
        "[data-theme-repo-picker-message]": message,
        "[data-theme-repo-picker-more]": moreButton,
        "[data-theme-repo-picker-icons]": icons,
        "[data-theme-repo-picker-text]": text,
      })[selector],
  };
  const fetch = vi.fn(async (url: string) => {
    const page = Number(new URL(url, "http://forgejo").searchParams.get("page"));
    return {
      ok,
      json: async () => ({ ok, data: (pages[page - 1] ?? []).map(repository => ({ repository })) }),
      headers: { get: () => String(total) },
    };
  });
  const document = {
    querySelectorAll: () => [picker],
    createElement: (tag: string) => element(tag),
    addEventListener: (name: string, fn: Listener) => docListeners.set(name, fn),
    getElementById: () => picker,
  };
  runInNewContext(script, {
    document,
    fetch,
    location: { href: "" },
    URLSearchParams,
    AbortController,
    setTimeout,
    clearTimeout,
    Number,
    String,
  });
  const settle = () => new Promise(resolve => setTimeout(resolve, 0));
  return { list, message, moreButton, fetch, field, query, listeners, docListeners, picker, settle };
}

const webapp = { id: 1, full_name: "acme/webapp", link: "/acme/webapp" };
const notes = { id: 2, full_name: "alex/notes", link: "/alex/notes", private: true };

describe("repository picker", () => {
  it("loads Forgejo's repository search for the owner, newest activity first, and lists the names", async () => {
    const f = fixture({ exclusive: "", team: "4", current: "2" }, [[webapp, notes]]);
    await f.settle();
    const params = new URL(f.fetch.mock.calls[0][0], "http://forgejo").searchParams;
    expect(Object.fromEntries(params)).toMatchObject({
      sort: "updated",
      order: "desc",
      uid: "7",
      limit: "2",
      page: "1",
      team_id: "4",
      exclusive: "1",
    });
    const rows = f.list.children.map(item => item.children[0]);
    expect(rows.map(row => row.children[1].textContent)).toEqual(["webapp", "notes"]);
    expect(rows.map(row => row.href)).toEqual(["/acme/webapp", "/alex/notes"]);
    expect(rows[1].attributes.get("aria-current")).toBe("true");
    expect(rows[0].attributes.has("aria-current")).toBe(false);
    expect(f.list.attributes.has("aria-busy")).toBe(false);
  });

  it("shows owner and name when asked, and never links outside the site", async () => {
    const f = fixture({ fullName: "" }, [[{ ...webapp, link: "https://evil.example/x" }]]);
    await f.settle();
    const row = f.list.children[0].children[0];
    expect(row.children[1].textContent).toBe("acme/webapp");
    expect(row.href).toBe("#");
  });

  it("offers Show more while the search has more repositories and appends the next page", async () => {
    const f = fixture({}, [[webapp, notes], [{ id: 3, full_name: "acme/api", link: "/acme/api" }]], 3);
    await f.settle();
    expect(f.moreButton.hidden).toBe(false);
    f.listeners.get("more:click")?.({});
    await f.settle();
    expect(f.list.children).toHaveLength(3);
    expect(f.moreButton.hidden).toBe(true);
  });

  it("waits for its dropdown to open when lazy, then shows the search field", async () => {
    const f = fixture({ lazy: "" }, [[webapp]]);
    await f.settle();
    expect(f.fetch).not.toHaveBeenCalled();
    f.docListeners.get("toggle")?.({ target: { open: true, querySelector: () => f.picker } });
    await f.settle();
    expect(f.fetch).toHaveBeenCalledOnce();
    expect(f.field.hidden).toBe(false);
    expect(f.query.focus).toHaveBeenCalled();
  });

  it("reports a failed search instead of an empty list", async () => {
    const f = fixture({}, [], 0, false);
    await f.settle();
    expect(f.message.hidden).toBe(false);
    expect(f.message.textContent).toBe("Could not load");
  });
});
