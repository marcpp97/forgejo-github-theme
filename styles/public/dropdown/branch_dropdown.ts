/*!
 * Copyright (c) https://github.com/lutinglt
 *
 * See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { css, cssCombine, customThemeVars, otherThemeVars, themeVars } from "@lutinglt/gitea-github-theme/core";
import { animationDown } from "@lutinglt/gitea-github-theme/styles/common";
import { fallbackVar } from "@vanilla-extract/css";

// 分支菜单
const branchDropdown = css`
  .js-branch-tag-selector > .ui.dropdown.custom > .menu {
    width: ${fallbackVar(customThemeVars.branchMenuWidth, "320px")};
    max-width: 640px;
    > .scrolling.menu > .item {
      ${animationDown};
      height: 32px;
    }
    padding: 0;
    /* GitHub's "Switch branches/tags" title and close button, added by branch-selector.js. */
    > .branch-menu-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 8px 8px 16px;
      font-size: 14px;
      font-weight: 600;
      > .branch-menu-close {
        display: grid;
        place-items: center;
        width: 32px;
        height: 32px;
        padding: 0;
        border: 0;
        border-radius: ${otherThemeVars.border.radius};
        background: transparent;
        color: ${themeVars.color.text.light.num1};
        cursor: pointer;
        &:hover {
          background: ${themeVars.color.hover.self};
          color: ${themeVars.color.text.self};
        }
      }
    }
    /* Search field with GitHub's leading magnifier instead of Forgejo's trailing filter icon. */
    > .ui.icon.search.input {
      margin: 0 16px 8px !important;
      width: auto !important;
      > i.icon {
        left: 0;
        right: auto;
        padding: 0 0 0 10px;
        display: flex;
        align-items: center;
        color: ${themeVars.color.text.light.num1};
        > svg {
          display: none;
        }
        &::before {
          content: "";
          width: 16px;
          height: 16px;
          background: currentColor;
          mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z'/%3E%3C/svg%3E") center / 16px no-repeat;
        }
      }
      > input {
        padding-left: 34px !important;
        padding-right: 12px !important;
      }
    }
    /* Underlined tabs, like GitHub's. */
    > .branch-tag-tab {
      display: flex;
      gap: 4px;
      padding: 0 8px;
      border-bottom: 1px solid ${themeVars.color.light.border};
      > .branch-tag-item {
        position: relative;
        margin: 0 0 4px;
        padding: 8px !important;
        height: auto;
        border: 0 !important;
        border-radius: ${otherThemeVars.border.radius} !important;
        background: transparent !important;
        color: ${themeVars.color.text.self};
        font-weight: 400;
        line-height: 20px;
        svg {
          display: none;
        }
        &.active {
          font-weight: 600;
          &::after {
            content: "";
            position: absolute;
            right: 8px;
            bottom: -5px;
            left: 8px;
            height: 2px;
            border-radius: 6px;
            background: ${themeVars.github.underlineNav.borderColor.active};
          }
        }
        &:hover:not(.active) {
          color: inherit;
          background: ${themeVars.color.hover.self} !important;
        }
      }
    }
    > .branch-tag-divider {
      display: none;
    }
    > .scrolling.menu {
      padding: 8px 0;
      /* The current ref gets a check mark; the others line up after it. The repeated class outranks the shared
         dropdown item padding, which is !important too. */
      > .item.item.item.item {
        position: relative;
        padding-left: 32px !important;
        font-weight: 400 !important;
        &.selected:not(.active):not(:hover) {
          background: transparent !important;
        }
        &.selected {
          &::before {
            content: "";
            position: absolute;
            left: 12px;
            top: 50%;
            width: 16px;
            height: 16px;
            margin-top: -8px;
            background: currentColor;
            mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z'/%3E%3C/svg%3E") center / 16px no-repeat;
          }
        }
      }
    }
    /* "View all branches" / "View all tags", added by branch-selector.js. */
    > .branch-menu-footer {
      display: block;
      padding: 8px 16px;
      border-top: 1px solid ${themeVars.color.light.border};
      color: ${themeVars.color.text.self};
      font-size: 14px;
      line-height: 20px;
      &:hover {
        background: ${themeVars.color.hover.self};
        text-decoration: none;
      }
    }
  }
`;

// 手机页面下的分支菜单
const branchDropdownMobile = css`
  @media (max-width: 767.98px) {
    /* 修复手机下分支菜单宽度过宽 */
    .js-branch-tag-selector > .ui.dropdown.custom > .menu {
      width: auto;
    }
  }
`;

export default cssCombine(branchDropdown, branchDropdownMobile);
