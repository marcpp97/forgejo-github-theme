import { css, otherThemeVars, themeVars } from "@lutinglt/gitea-github-theme/core";
import { activeItemAfterStyle } from "@lutinglt/gitea-github-theme/styles/common";

export default css`
  .repository .file-tree :is(.diff-file-tree-items, .file-tree-items) {
    width: 100%;
    overflow: visible;
    padding: 0;
  }
  .repository .file-tree .sub-items {
    position: relative;
  }
  .repository .file-tree .sub-items::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: calc(10px - var(--file-tree-indent, 8px));
    border-left: 1px solid transparent;
    pointer-events: none;
  }
  .repository .file-tree:hover .sub-items::before,
  .repository .file-tree:focus-within .sub-items::before {
    border-color: ${themeVars.color.light.border};
  }
  .repository .file-tree .sub-items {
    margin-left: var(--file-tree-indent, 8px);
    gap: 0;
    padding-left: 0;
    border: 0;
  }
  .repository .file-tree .item-directory,
  .repository .file-tree .item-file.item-file {
    display: flex;
    align-items: center;
    position: relative;
    gap: 8px;
    height: 32px;
    min-height: 32px;
    margin: 0;
    padding: 0 4px;
    border-radius: ${otherThemeVars.border.radius};
    font-size: 14px;
    line-height: 20px;
    color: ${themeVars.color.text.self};
    text-decoration: none;
    cursor: pointer;
  }
  .repository .file-tree .item-file.item-file {
    padding-left: 24px;
  }
  .repository .file-tree .item-directory:hover,
  .repository .file-tree .item-file.item-file:hover {
    background: ${themeVars.github.control.transparent.bgColor.hover};
    box-shadow: none;
  }
  .repository .file-tree :is(.item-file, .item-directory):focus-visible {
    outline: 2px solid ${themeVars.github.fgColor.accent};
    outline-offset: -2px;
  }
  .repository .file-tree :is(.item-file, .item-directory).selected {
    background: ${themeVars.github.control.transparent.bgColor.active};
  }
  .repository .file-tree :is(.item-file, .item-directory).selected::after {
    ${activeItemAfterStyle}
    left: -8px;
    height: 24px;
    top: 4px;
  }
  .repository .file-tree .gt-ellipsis {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .repository .file-tree .item-directory > svg:first-child {
    width: 12px;
    height: 12px;
    flex: 0 0 12px;
    min-width: 12px;
    min-height: 12px;
    color: ${themeVars.color.text.light.num1};
  }
  .repository .file-tree .item-directory > svg:nth-child(2) {
    display: none;
  }
  .repository .file-tree .item-directory[aria-expanded="false"] > svg:nth-child(2) {
    display: block;
    color: ${themeVars.color.text.light.num1} !important;
  }
  .repository .file-tree .item-directory[aria-expanded="false"] > .tree-directory-icon {
    display: none;
  }
  .repository .file-tree .tree-directory-icon {
    color: ${themeVars.color.text.light.num1} !important;
  }
  .repository .file-tree .item-file > svg:not(.tree-file-icon) {
    display: none;
  }
  .repository .file-tree .item-file > svg.tree-file-icon {
    order: -1;
    flex: 0 0 16px;
  }
  /* Forgejo renders the diff tree in Vue, so its GitHub icons are drawn here instead of inserted into its rows. */
  #diff-file-tree .item-directory::before,
  #diff-file-tree .item-file::before {
    content: "";
    flex: 0 0 16px;
    width: 16px;
    height: 16px;
    background-color: currentcolor;
    mask: var(--diff-tree-icon) center / 16px no-repeat;
  }
  #diff-file-tree .item-directory > svg:first-child {
    order: -1;
  }
  #diff-file-tree .item-directory::before {
    --diff-tree-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M.513 1.513A1.75 1.75 0 0 1 1.75 1h3.5c.55 0 1.07.26 1.4.7l.9 1.2a.25.25 0 0 0 .2.1H13a1 1 0 0 1 1 1v.5H2.75a.75.75 0 0 0 0 1.5h11.978a1 1 0 0 1 .994 1.117L15 13.25A1.75 1.75 0 0 1 13.25 15H1.75A1.75 1.75 0 0 1 0 13.25V2.75c0-.464.184-.91.513-1.237'/%3E%3C/svg%3E");
    color: ${themeVars.color.text.light.num1};
  }
  /* Vue swaps the chevron with the folder's state; collapsed folders show its closed folder icon instead. */
  #diff-file-tree .item-directory:has(> .octicon-chevron-right)::before {
    display: none;
  }
  #diff-file-tree .item-directory:has(> .octicon-chevron-right) > svg:nth-child(2) {
    display: block;
    color: ${themeVars.color.text.light.num1} !important;
  }
  #diff-file-tree .item-file::before {
    --diff-tree-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M1 1.75C1 .784 1.784 0 2.75 0h7.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V4.664a.25.25 0 0 0-.073-.177l-2.914-2.914a.25.25 0 0 0-.177-.073ZM8 3.25a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5a.75.75 0 0 1-1.5 0V7h-1.5a.75.75 0 0 1 0-1.5h1.5V4A.75.75 0 0 1 8 3.25m-3 8a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75'/%3E%3C/svg%3E");
    order: -1;
  }
  #diff-file-tree .item-file:has(.octicon-diff-added)::before {
    --diff-tree-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V4.664a.25.25 0 0 0-.073-.177l-2.914-2.914a.25.25 0 0 0-.177-.073Zm4.48 3.758a.75.75 0 0 1 .755.745l.01 1.497h1.497a.75.75 0 0 1 0 1.5H9v1.507a.75.75 0 0 1-1.5 0V9.005l-1.502.01a.75.75 0 0 1-.01-1.5l1.507-.01-.01-1.492a.75.75 0 0 1 .745-.755'/%3E%3C/svg%3E");
    color: ${themeVars.color.green.self};
  }
  #diff-file-tree .item-file:has(.octicon-diff-removed)::before {
    --diff-tree-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V4.664a.25.25 0 0 0-.073-.177l-2.914-2.914a.25.25 0 0 0-.177-.073Zm4.5 6h2.242a.75.75 0 0 1 0 1.5h-2.24l-2.254.015a.75.75 0 0 1-.01-1.5Z'/%3E%3C/svg%3E");
    color: ${themeVars.color.red.self};
  }
  .repository .file-tree [data-tree-filtered] {
    display: none !important;
  }

  .file-tree [hidden] {
    display: none !important;
  }
`;
