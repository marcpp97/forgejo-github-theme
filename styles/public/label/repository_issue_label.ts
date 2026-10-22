import { css } from "@lutinglt/gitea-github-theme/core";

// GitHub's issue label colours. The label template passes the source colour and Forgejo's contrast text colour as
// variables. GitHub lightens dark labels in dark mode by how far their perceived lightness falls below 60%; the
// luma variant carries that lightness in its alpha channel so one relative colour can use it as a number.
export default css`
  .ui.ui.label.repository-label {
    --repository-label-luma: rgb(
      from var(--repository-label-color) r g b / calc((r * 0.2126 + g * 0.7152 + b * 0.0722) / 255)
    );
    --repository-label-dark-text: hsl(from var(--repository-label-luma) h s calc(l + max(0, (0.6 - alpha) * 100)) / 1);
    --repository-label-background: light-dark(
      var(--repository-label-color),
      rgb(from var(--repository-label-color) r g b / 0.18)
    );
    --repository-label-text: light-dark(var(--repository-label-foreground), var(--repository-label-dark-text));
    border: 1px solid
      light-dark(
        hsl(from var(--repository-label-luma) h s calc(l - 25) / clamp(0, (alpha - 0.96) * 100, 1)),
        hsl(from var(--repository-label-dark-text) h s l / 0.3)
      );
    background-color: var(--repository-label-background) !important;
    color: var(--repository-label-text) !important;
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    padding: 0 6px;
    border-radius: 20px;
    vertical-align: middle;
  }
`;
