import { css, themeVars } from "@lutinglt/gitea-github-theme/core";

// Shared by commit and pull-request diffs; Forgejo still owns the Vue tree.
// #diff-container wraps every diff line, so a :has() on it restyles the whole diff on each DOM change;
// box.tmpl sets these classes instead.
export default css`
  /* resizable-divider.js writes this on #diff-container. Inherited, every diff line would be restyled. */
  @property --diff-file-tree-width {
    syntax: "<length>";
    inherits: false;
    initial-value: 296px;
  }
  .repository #diff-container.diff-has-file-tree {
    display: grid;
    grid-template-columns: var(--diff-file-tree-width, 296px) 1px minmax(0, 1fr);
    /* Row 1 is the toolbar spanning every column, row 2 the tree, divider and files. */
    grid-template-rows: auto 1fr;
    position: relative;
    min-height: 100dvh;
    align-items: start;
    gap: 0;
  }
  .repository #diff-container.diff-file-tree-hidden {
    grid-template-columns: minmax(0, 1fr);
  }
  .repository #diff-container.diff-file-tree-hidden > .diff-file-tree-panel,
  .repository #diff-container.diff-file-tree-hidden > .resizable-divider {
    display: none;
  }
  .repository .diff-file-tree-panel {
    min-width: 0;
    position: sticky;
    height: 100dvh;
    z-index: 20;
    top: calc(var(--sticky-top-offset, 0px) + var(--diff-toolbar-height));
    max-height: calc(100dvh - var(--sticky-top-offset, 0px) - var(--diff-toolbar-height));
  }
  .repository .diff-file-tree-scroll {
    overflow: auto;
    scrollbar-gutter: stable;
    height: 100dvh;
    max-height: calc(100dvh - var(--sticky-top-offset, 0px) - var(--diff-toolbar-height));
    padding: 16px 24px 24px;
  }
  .repository .diff-file-tree-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .repository #diff-container #diff-file-tree {
    height: auto;
    min-height: 0;
    max-height: none;
    width: auto;
    max-width: none;
    flex-basis: auto;
    padding: 0;
    margin: 0;
    overflow: visible;
    position: static;
  }
  .repository #diff-file-boxes > [data-tree-filtered] {
    display: none !important;
  }
  .diff-tree-empty {
    padding: 8px 4px;
    color: ${themeVars.color.text.light.num1};
    font-size: 14px;
  }
  .repository #diff-container > #diff-content-container {
    min-width: 0;
    padding: 16px 24px 24px;
  }
  /* The toolbar height is fixed so the sticky tree and file headers can sit right below it. */
  .repository #diff-container {
    --diff-toolbar-height: 56px;
  }
  .repository #diff-container > .diff-content-controls {
    grid-column: 1 / -1;
    box-sizing: border-box;
    background: ${themeVars.color.body};
    border: 0;
    border-bottom: 1px solid ${themeVars.color.light.border};
    border-radius: 0;
    box-shadow: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    height: var(--diff-toolbar-height);
    padding: 0 24px;
    margin: 0;
    position: sticky;
    top: var(--sticky-top-offset, 0px);
    z-index: 21;
  }
  .diff-content-controls-left {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }
  .diff-toggle-file-tree-button > svg.tw-hidden {
    display: none;
  }
  @media (max-width: 767.98px) {
    .repository .diff-toggle-file-tree-button.theme-icon-button.not-mobile {
      display: inline-flex !important;
    }
    .repository #diff-container.diff-mobile-tree-open {
      display: flex;
      flex-direction: column;
    }
    .repository #diff-container.diff-mobile-tree-open > .diff-file-tree-panel {
      display: block !important;
      position: static;
      max-height: none;
      height: auto;
      width: 100%;
    }
    .repository #diff-container.diff-mobile-tree-open .diff-file-tree-scroll {
      max-height: none;
      height: auto;
      padding: 0 16px 16px;
    }
    .repository #diff-container.diff-mobile-tree-open > #diff-content-container {
      display: contents;
    }
    .repository #diff-container.diff-mobile-tree-open .diff-content-controls {
      order: -1;
    }
    /* On phones the controls wrap, so the toolbar grows and scrolls away; file headers stick to the top. */
    .repository #diff-container {
      --diff-toolbar-height: 0px;
    }
    .repository #diff-container > .diff-content-controls {
      position: static;
      height: auto;
      flex-wrap: wrap;
      padding: 8px 16px;
    }
    .repository #diff-container.diff-mobile-tree-open .diff-content-body,
    .repository #diff-container.diff-mobile-tree-open .diff-code-search {
      display: none;
    }
    .repository #diff-container.diff-has-file-tree {
      display: block;
    }
    .repository #diff-container.diff-mobile-tree-open {
      display: flex;
    }
    .repository #diff-container > #diff-content-container {
      padding: 16px;
    }
    .repository #diff-container > .diff-file-tree-panel,
    .repository #diff-container > .resizable-divider {
      display: none;
    }
  }
`;
