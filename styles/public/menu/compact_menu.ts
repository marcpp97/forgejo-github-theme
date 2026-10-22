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

// 单行双选项菜单
const smallCompactMenu = css`
  /* 编辑/预览切换菜单(仓库编辑文件时的编辑器操作栏左侧) */
  .page-content.repository.file.editor #editor-bar,
  /* 订阅/关注切换菜单(应只选中订阅/关注页面, 不能选中通知页面) */
  /* No :has() on the container: Chrome would then track every .ui.container and restyle the whole page on editor tab changes. */
  .page-content.user.notification:not(#notification_div) > .ui.container {
    .switch {
      --switch-item-min-height: 30px;
      --switch-padding-inline: 12px;
      background: ${themeVars.github.controlTrack.bgColor.rest} !important;
      border: 1px solid ${themeVars.color.secondary.self};
      font-size: 14px;
      gap: 4px;
      height: 32px;
      min-height: 32px !important;
      > .item {
        background: unset !important;
        border: 1px solid #0000;
        border-radius: ${otherThemeVars.border.radius};
        height: 30px;
        line-height: 20px;
        margin: 0;
        min-height: 30px;
        outline: 0;
        padding: 4px 12px !important;
        &.active {
          background: ${themeVars.github.controlKnob.bgColor.rest} !important;
          border-color: ${themeVars.color.secondary.self};
          font-weight: 600;
        }
        &::before {
          display: none;
        }
        &:not(.active) {
          padding: 4px 12px !important;
          &:hover {
            background: ${themeVars.github.control.transparent.bgColor.hover} !important;
          }
        }
      }
      > .item:has(+ .active.item),
      > .active.item + .item {
        margin: 0;
        padding: 4px 12px !important;
      }
    }
  }
`;

export default cssCombine(smallCompactMenu);
