---
version: 1.0.0
---

# Forgejo GitHub Theme 1.0.0 - Forgejo 17, page by page

The theme now targets Forgejo 17, and most pages Forgejo has were compared against GitHub and brought in line: Actions,
project boards, settings, commits, branches, labels and milestones, notifications, the create pages and more. GitHub's
layouts are rendered by the templates instead of being patched in the browser, so pages no longer shift after they load.

# Compatibility

This release targets Forgejo `17`. It was tested against Forgejo `17.0.0`, including the bundled template overrides.

The templates are bound to Forgejo 17's template data. On Forgejo 16 keep using 0.4.0; install this release together
with the upgrade to Forgejo 17, stylesheets and templates at the same time.
