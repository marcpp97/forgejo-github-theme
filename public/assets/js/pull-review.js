(() => {
  const actions = document.querySelector(".github-pull-review .merge-section > .pull-merge-actions");
  const form = actions?.querySelector(":scope > #pull-request-merge-form");
  if (!form) return;
  // Forgejo colours the collapsed button red whenever checks are unmet, even when the action
  // only schedules the merge. A label longer than the plain merge action is a scheduled merge.
  const plain = (window.config?.pageData?.pullRequestMergeForm?.mergeStyles ?? []).map(style =>
    style.textDoMerge?.trim()
  );
  const sync = () => {
    const label = form.querySelector(".merge-button .button-text")?.textContent.replace(/\s+/g, " ").trim();
    actions.classList.toggle("merge-scheduled", Boolean(label) && !plain.includes(label));
  };
  sync();
  new MutationObserver(sync).observe(form, { childList: true, subtree: true, characterData: true });
})();
