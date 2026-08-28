# Upstream template

This project directly uses the open-source template and theme configuration from:

- Website: https://hku-cg.github.io/
- Source repository: https://github.com/HKU-CG/HKU-CG.github.io
- Theme: Wowchemy 4.8.0 for Hugo (formerly Hugo Academic)
- License: MIT; see `LICENSE.md`
- Hugo module pin: `github.com/wowchemy/wowchemy-hugo-modules/wowchemy` at commit `e58ee0ffc576`

The following upstream structure is intentionally retained:

- `go.mod` and `go.sum`
- `config/_default/` and its `minimal` / `mrrobot` theme settings
- `content/home/` Wowchemy widgets
- `content/People/` widget page
- `layouts/` overrides used by the HKU-CG site
- `assets/js/` theme switching behavior
- Hugo Extended + Dart Sass GitHub Pages workflow

HKU-CG member photos, group photos, publication images, names, addresses, and research content are not included. Skill Lab content and branding replace those assets.
