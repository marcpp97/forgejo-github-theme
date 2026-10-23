---
version: 1.1.0
---

# Forgejo GitHub Theme 1.1.0 - Home, switcher and motion

The signed-in dashboard now follows GitHub's home, with the account in context, top repositories, an activity feed
grouped by day and a rail of the work that waits on you. A repository switcher sits beside the repository name, and
pages appear whole and change with a short fade instead of building up and jumping while they load.

# Compatibility

This release targets Forgejo `17`. It was tested against Forgejo `17.0.0`, including the bundled template overrides.

Install the stylesheets and templates together, as with 1.0.0. Page transitions use cross-document view transitions,
which current Chromium-based browsers and Safari animate; other browsers change pages as before.
