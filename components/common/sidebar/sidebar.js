(() => {
  const mobile = matchMedia("(max-width: 767.98px)");
  const init = page => {
    let collapsed = mobile.matches;
    try {
      if (!mobile.matches) collapsed = localStorage.getItem(page.dataset.themeSidebar) === "true";
    } catch {
      /* The sidebar also works when browser storage is unavailable. */
    }
    const update = () => {
      page.classList.toggle("theme-sidebar-collapsed", collapsed);
      for (const button of page.querySelectorAll("[data-theme-sidebar-toggle]"))
        button.setAttribute("aria-expanded", String(!collapsed));
    };
    // Delegated, so toggles inside content that Forgejo refreshes in place (the Actions run list) keep working.
    page.addEventListener("click", event => {
      if (!event.target.closest?.("[data-theme-sidebar-toggle]")) return;
      collapsed = !collapsed;
      update();
      const next = page.querySelector(collapsed ? "[data-theme-sidebar-expand]" : ".theme-sidebar-toggle");
      next?.focus();
      if (!mobile.matches)
        try {
          localStorage.setItem(page.dataset.themeSidebar, String(collapsed));
        } catch {
          /* Optional desktop preference. */
        }
    });
    mobile.addEventListener("change", () => {
      collapsed = mobile.matches;
      update();
    });
    update();

    // The sidebar sticks to the top of the window but starts below the navbar, so a full window's height would put its
    // bottom, with the collapse toggle, out of view until the page scrolls. It takes the height left beneath its top.
    const aside = page.querySelector(":scope > .theme-sidebar");
    if (!aside?.style || !aside.getBoundingClientRect) return;
    let frame = 0;
    const fit = () => {
      frame = 0;
      aside.style.setProperty(
        "--theme-sidebar-offset",
        `${Math.max(0, Math.round(aside.getBoundingClientRect().top))}px`
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(fit);
    };
    document.addEventListener("scroll", schedule, { passive: true });
    globalThis.addEventListener?.("resize", schedule);
    fit();
  };
  for (const page of document.querySelectorAll("[data-theme-sidebar]")) init(page);
  // Forgejo replaces the whole notifications page element after an action; set the new one up too.
  if (typeof MutationObserver === "undefined" || !document.body) return;
  new MutationObserver(records => {
    for (const record of records)
      for (const node of record.addedNodes)
        if (node instanceof Element && node.matches("[data-theme-sidebar]")) init(node);
  }).observe(document.body, { childList: true, subtree: true });
})();
