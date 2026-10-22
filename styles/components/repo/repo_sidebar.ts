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

import { css, cssCombine, themeVars } from "@lutinglt/gitea-github-theme/core";

// 仓库代码布局调整, 侧边栏宽度调整
const repoGrid = css`
  .repo-grid-filelist-sidebar {
    grid-template-columns: auto 312px;
    gap: 16px;
  }

  @media (max-width: 767.98px) {
    .repo-grid-filelist-sidebar {
      grid-template-columns: 100%;
    }
  }
  .repo-grid-filelist-sidebar {
    .repo-home-sidebar-top,
    .repo-home-sidebar-bottom {
      padding-left: 24px;
    }
  }
`;

// GitHub's About section, measured on github.com at the same width: 12px between its blocks, 8px between metadata
// rows, links that turn accent blue on hover.
const repoSidebarTop = css`
  .page-content.repository.file.list .repo-home-sidebar-top {
    .repo-about-block {
      gap: 0;
    }
    .repo-about-settings {
      color: ${themeVars.color.text.light.num1};
      &:hover {
        background: transparent;
        color: ${themeVars.github.fgColor.accent};
      }
    }
    .repo-description {
      margin-top: 12px;
    }
    .repo-home-sidebar-website {
      gap: 8px;
      margin-top: 0;
      color: ${themeVars.github.fgColor.accent};
      font-size: 14px;
      font-weight: 600;
      line-height: 21px;
      & svg {
        color: ${themeVars.color.text.self};
      }
      &:hover {
        text-decoration: underline;
      }
    }
    .repo-about-topic-list {
      gap: 8px 2px;
      margin-top: 12px;
      .repo-description + & {
        margin-top: 0;
      }
      &:not(:has(.repo-topic)) {
        display: none;
      }
    }
    /* Beats the shared topic label rule in repo.ts, which also styles explore and profile lists. */
    #repo-topics .repo-about-topic-list .ui.label.repo-topic {
      margin: 0;
      padding: 2px 12px;
      border: 1px solid transparent;
      border-radius: 2em;
      font-size: 12px;
      font-weight: 600;
      line-height: 19.5px;
      &:hover {
        background: ${themeVars.github.bgColor.accent.emphasis};
        color: ${themeVars.github.fgColor.onEmphasis};
      }
    }
    .repo-home-sidebar-metadata {
      gap: 8px;
      margin-top: 8px;
      .flex-text-block {
        gap: 8px;
        min-height: 0;
        margin: 0;
        color: ${themeVars.color.text.light.num1};
        font-size: 14px;
        font-weight: 400;
        line-height: 21px;
        & b {
          font-weight: 600;
        }
      }
      a.flex-text-block:hover {
        color: ${themeVars.github.fgColor.accent};
        text-decoration: none;
      }
    }
  }
`;

// GitHub's lower sections: a divider, 16px, the heading with its counter beside it, 12px, the content, 16px.
const repoSidebarBottom = css`
  .page-content.repository.file.list .repo-home-sidebar-bottom {
    &.flex-relaxed-list {
      gap: 0;
    }
    > .divider {
      margin: 16px 0 !important;
      &:first-child {
        margin-top: 0 !important;
      }
    }
    .repo-home-sidebar-header {
      justify-content: flex-start;
      gap: 4px;
      margin: 0 0 12px;
      line-height: 24px;
      & a.muted:hover {
        color: ${themeVars.github.fgColor.accent};
        text-decoration: none;
      }
    }
    /* Languages: an 8px bar of 2px-separated segments over a legend of dot, name and share. */
    .language-stats {
      gap: 2px;
      height: 8px;
      border-radius: 3px;
      outline: none;
    }
    .language-stats-details {
      display: flex;
      flex-wrap: wrap;
      gap: 3px 12px;
      margin-top: 11px;
      padding-bottom: 0;
      .item {
        display: flex;
        align-items: center;
        color: ${themeVars.color.text.self};
        font-size: 12px;
        line-height: 18px;
        .color-icon {
          flex: 0 0 8px;
          width: 8px;
          height: 8px;
          margin-right: 8px;
        }
        .tw-font-semibold {
          margin-right: 4px;
          color: ${themeVars.color.text.self};
        }
      }
    }
  }
`;

export default cssCombine(repoGrid, repoSidebarTop, repoSidebarBottom);
