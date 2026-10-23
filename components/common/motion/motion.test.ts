import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

describe("page motion", () => {
  it("paints a page as its HTML arrives, without holding the first paint", () => {
    const head = read("../../../templates/base/head_style.tmpl");
    const footer = read("../../../templates/base/footer_content.tmpl");
    expect(head).not.toContain('rel="expect"');
    expect(head).not.toContain("blocking=");
    expect(footer).not.toContain("github-content-end");
  });

  it("opens another page without a cross-document view transition", () => {
    const css = read("./motion.css");
    expect(css).not.toMatch(/@view-transition\s*{/);
    expect(css).not.toContain("view-transition-name");
    expect(css).not.toContain("::view-transition");
  });

  it("keeps navbar and tab menus above the page", () => {
    const css = read("./motion.css");
    expect(css).toMatch(/#navbar \{\s*position: relative;\s*z-index: 200;/);
    expect(css).toMatch(/\.repository-tab-nav \{\s*position: relative;\s*z-index: 199;/);
  });

  it("fades late content in, and drops that for visitors who ask for less motion", () => {
    const css = read("./motion.css");
    expect(css).toMatch(/\.theme-fade-in \{\s*animation: 160ms/);
    const reduced = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
    expect(reduced).toContain(".theme-fade-in {\n    animation: none;");
  });
});
