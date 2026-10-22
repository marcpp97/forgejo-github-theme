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

import { css, cssCombine, otherThemeVars, themeVars } from "@lutinglt/gitea-github-theme/core";

// 文件列表页面下的分支按钮
const branchButton = css`
  .page-content.repository.file.list {
    .js-branch-tag-selector > .ui.dropdown.custom > .menu > .scrolling.menu {
      /* 显示默认分支的标签 */
      .ui.label {
        background-color: ${themeVars.color.menu};
        border: 1px solid ${themeVars.color.light.border};
        margin-top: 1px;
        margin-left: auto;
        margin-right: 20px; /* gitea 有 RSS 留出足够的空间 */
      }
    }
  }
`;
// 仓库同步派生
const syncFork = css`
  .page-content.repository.file.list {
    .repo-home-filelist > .ui.message {
      background: ${themeVars.color.box.header};
      padding: 8px 8px 8px 16px;
      margin: 16px 0px;
      .ui.button {
        min-width: 96px;
      }
    }
  }
`;
// 仓库文件列表
const repoFiles = css`
  /* 文件列表和提交列表的按钮组 */
  .repo-button-row {
    margin: 16px 0;
    .repo-button-row-right {
      /* 添加文件按钮 */
      .repo-add-file {
        padding: 0px 26px 0px 12px;
        .menu > .item {
          min-width: 128px;
          svg {
            margin-top: 0;
            margin-right: 4px !important;
          }
        }
      }
    }
  }
  .repository.file.list {
    #repo-files-table {
      /* 头部最后一次提交 */
      .repo-file-line {
        padding-right: 16px;
        /* 父目录 */
        &.parent-link {
          gap: 0.5rem;
          padding-left: 16px;
          svg {
            margin-right: 2px;
          }
        }
      }
    }
    /* Below 544px GitHub lets the README box reach the screen edges; the file list keeps its gutter. */
    @media (max-width: 543.98px) {
      #readme {
        margin-left: -16px;
        margin-right: -16px;
      }
    }
    #readme {
      .file-header {
        background: ${themeVars.color.body};
        min-height: 48px;
        padding: 0px 8px !important;
        overflow-x: visible;
        svg {
          color: ${themeVars.color.text.light.num1};
        }
        /* GitHub's README box header: underline tabs for the README and the community files. */
        .file-header-left {
          padding: 0 !important;
        }
        .repo-readme-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          & > a {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            position: relative;
            height: 32px;
            padding: 6px 8px;
            border-radius: ${otherThemeVars.border.radius};
            color: ${themeVars.color.text.self};
            font-size: 14px;
            font-weight: 400;
            line-height: 21px;
            &:hover {
              background: ${themeVars.github.control.transparent.bgColor.hover};
              text-decoration-line: none;
            }
            &.active {
              font-weight: 600;
              &::after {
                content: "";
                position: absolute;
                left: 0;
                bottom: -8px;
                width: 100%;
                height: 2px;
                border-radius: ${otherThemeVars.border.radius};
                background: ${themeVars.github.underlineNav.borderColor.active};
              }
            }
          }
        }
        /* The README outline indents each heading level by 16px. */
        .theme-dropdown-action[data-level="2"] {
          padding-left: 24px;
        }
        .theme-dropdown-action[data-level="3"] {
          padding-left: 40px;
        }
        .theme-dropdown-action:is([data-level="4"], [data-level="5"], [data-level="6"]) {
          padding-left: 56px;
        }
        .file-header-right {
          .btn-octicon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0px 8px;
            border-radius: ${otherThemeVars.border.radius};
            height: 28px;
            width: 28px;
            &:hover {
              background: ${themeVars.github.control.transparent.bgColor.hover};
              box-shadow: inset 0 0 0 1px ${themeVars.github.control.transparent.borderColor.active};
            }
          }
        }
      }
    }
  }
`;
// 手机下隐藏提交信息
const repoFilesMobile = css`
  @media (max-width: 767.98px) {
    #repo-files-table {
      grid-template-columns: 1fr auto;
      .repo-file-line {
        grid-column: 1 / span 2;
      }
      .repo-file-cell {
        &.name {
          max-width: none;
        }
        &.message {
          display: none;
        }
      }
    }
  }
`;

export default cssCombine(branchButton, syncFork, repoFiles, repoFilesMobile);
