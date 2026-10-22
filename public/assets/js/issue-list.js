(() => {
  const toolbar = document.querySelector("#issue-filters");
  const toggle = toolbar?.querySelector(".issue-mobile-filter-toggle");
  toggle?.addEventListener("click", () => {
    const open = toolbar.classList.toggle("issue-mobile-filters-open");
    toggle.setAttribute("aria-expanded", open);
  });
})();
