import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const script = readFileSync(new URL("./sidebar.js", import.meta.url), "utf8");

function events() {
  const listeners = new Map<string, (event: Record<string, unknown>) => void>();
  return {
    addEventListener: (name: string, callback: (event: Record<string, unknown>) => void) =>
      listeners.set(name, callback),
    emit: (name: string, event = {}) => listeners.get(name)?.(event),
  };
}

function fixture({ mobile = false, stored = "false", storageBlocked = false } = {}) {
  const media = { ...events(), matches: mobile };
  const storage = {
    getItem: vi.fn(() => {
      if (storageBlocked) throw new Error("Storage disabled");
      return stored;
    }),
    setItem: vi.fn(),
  };
  const control = () => ({ ...events(), setAttribute: vi.fn(), focus: vi.fn() });
  const expand = control();
  const collapse = control();
  const classes = new Set<string>();
  const aside = { top: 65, style: { setProperty: vi.fn() }, getBoundingClientRect: () => ({ top: aside.top }) };
  const page = {
    ...events(),
    dataset: { themeSidebar: "org_repositories_sidebar_collapsed" },
    classList: { toggle: (name: string, value: boolean) => (value ? classes.add(name) : classes.delete(name)) },
    querySelectorAll: () => [expand, collapse],
    querySelector: (selector: string) =>
      selector === ":scope > .theme-sidebar" ? aside : selector.includes("expand") ? expand : collapse,
  };
  const document = {
    ...events(),
    querySelectorAll: () => [page],
  };
  runInNewContext(script, {
    document,
    matchMedia: () => media,
    localStorage: storage,
    requestAnimationFrame: (callback: () => void) => (callback(), 1),
  });
  // Clicks reach the page, which finds the toggle the event came from.
  const click = (control: unknown) => page.emit("click", { target: { closest: () => control } });
  return { media, storage, expand, collapse, classes, click, aside, document };
}

describe("shared theme components", () => {
  it("runs the sidebar down to the footer instead of stopping above Forgejo's footer spacing", () => {
    const css = readFileSync(new URL("./sidebar.css", import.meta.url), "utf8");
    expect(css).toMatch(
      /\.full\.height:has\(> \.page-content\.theme-sidebar-layout\[data-theme-sidebar\]\) \{\s*padding-bottom: 0;/
    );
  });

  it("fits the sidebar beneath the navbar so its collapse toggle stays in view, and refits while scrolling", () => {
    const f = fixture();
    expect(f.aside.style.setProperty).toHaveBeenLastCalledWith("--theme-sidebar-offset", "65px");
    f.aside.top = -120;
    f.document.emit("scroll");
    expect(f.aside.style.setProperty).toHaveBeenLastCalledWith("--theme-sidebar-offset", "0px");
  });

  it("restores the desktop sidebar preference and moves focus to the available toggle", () => {
    const f = fixture({ stored: "true" });
    expect(f.classes.has("theme-sidebar-collapsed")).toBe(true);
    f.click(f.expand);
    expect(f.classes.has("theme-sidebar-collapsed")).toBe(false);
    expect(f.collapse.focus).toHaveBeenCalled();
    expect(f.expand.setAttribute).toHaveBeenLastCalledWith("aria-expanded", "true");
    expect(f.storage.setItem).toHaveBeenCalledWith("org_repositories_sidebar_collapsed", "false");
    f.click(f.collapse);
    expect(f.expand.focus).toHaveBeenCalled();
    expect(f.classes.has("theme-sidebar-collapsed")).toBe(true);
  });

  it("starts collapsed on mobile and never overwrites the desktop preference there", () => {
    const f = fixture({ mobile: true });
    expect(f.classes.has("theme-sidebar-collapsed")).toBe(true);
    f.click(f.expand);
    expect(f.classes.has("theme-sidebar-collapsed")).toBe(false);
    expect(f.storage.setItem).not.toHaveBeenCalled();
    f.media.matches = false;
    f.media.emit("change");
    expect(f.classes.has("theme-sidebar-collapsed")).toBe(false);
  });

  it("remains usable when storage is blocked", () => {
    const f = fixture({ storageBlocked: true });
    f.click(f.collapse);
    expect(f.classes.has("theme-sidebar-collapsed")).toBe(true);
  });
});
