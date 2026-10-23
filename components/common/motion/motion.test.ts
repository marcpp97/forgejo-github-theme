import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

describe("page motion", () => {
  it("paints a page once its content is parsed, not row by row", () => {
    const head = read("../../../templates/base/head_style.tmpl");
    const footer = read("../../../templates/base/footer_content.tmpl");
    expect(head).toContain('<link rel="expect" href="#github-content-end" blocking="render">');
    expect(footer).toContain('<span id="github-content-end" hidden></span>');
  });

  it("fades the old page out, then the new one in as it rises, keeping the navbar in place", () => {
    const css = read("./motion.css");
    expect(css).toMatch(/@view-transition\s*{\s*navigation: auto;/);
    expect(css).toContain("view-transition-name: github-navbar;");
    expect(css).toMatch(/::view-transition-old\(root\)\s*{\s*animation: 90ms/);
    expect(css).toMatch(/::view-transition-new\(root\)\s*{\s*animation: 200ms [^;]* 90ms both theme-fade-rise;/);
  });

  it("keeps navbar and tab menus above the page although their view-transition names make them stacking contexts", () => {
    const css = read("./motion.css");
    expect(css).toMatch(/#navbar \{\s*position: relative;\s*z-index: 200;\s*view-transition-name: github-navbar;/);
    expect(css).toMatch(/\.repository-tab-nav \{\s*position: relative;\s*z-index: 199;/);
  });

  it("drops page and content motion for visitors who ask for less", () => {
    const css = read("./motion.css");
    const reduced = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
    expect(reduced).toContain("navigation: none;");
    expect(reduced).toContain(".theme-fade-in {\n    animation: none;");
  });
});
