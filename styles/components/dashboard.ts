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

// 导航栏的工单/PR/里程碑仪表板
const dashboardIssues = css`
  .page-content.dashboard.issues {
    .list-header {
      background-color: ${themeVars.color.box.header};
      border: 1px solid ${themeVars.color.light.border};
      border-bottom: 0;
      border-top-left-radius: ${otherThemeVars.border.radius};
      border-top-right-radius: ${otherThemeVars.border.radius};
      height: 54px;
      padding: 16px 8px;
      .list-header-toggle {
        align-items: center;
        border: 0;
        > .item {
          background: unset !important;
          border-radius: ${otherThemeVars.border.radius};
          color: ${themeVars.color.text.light.num1};
          padding: 0px 8px;
          height: 30px;
          &:before {
            display: none;
          }
          &:hover {
            background: ${themeVars.github.control.transparent.bgColor.hover} !important;
          }
          &.active {
            color: ${themeVars.color.text.self};
            font-weight: 700;
          }
        }
      }
      > .ui.secondary.menu {
        > .item {
          border-radius: ${otherThemeVars.border.radius};
          color: ${themeVars.color.text.light.num1};
          padding: 0px 12px;
          height: 32px;
          &:hover {
            background: ${themeVars.github.control.transparent.bgColor.hover};
          }
        }
      }
    }
  }
`;

// 避免手机/平板下菜单错位
const issueListMobile = css`
  @media (max-width: 767.98px) {
    .page-content.dashboard.issues .list-header {
      height: auto;
    }
  }
`;

export default cssCombine(dashboardIssues, issueListMobile);
