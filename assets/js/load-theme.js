(function () {
  // First-time visitors start in light mode (0); the navbar toggle cycles light / dark / system.
  function getThemeMode() {
    if (localStorage.getItem('dark_mode') === null) {
      localStorage.setItem('dark_mode', '0');
    }
    return parseInt(localStorage.getItem('dark_mode'));
  }

  function canChangeTheme() {
    // If var is set, then user is allowed to change the theme variation.
    return Boolean(window.wcDarkLightEnabled);
  }

  function initThemeVariation() {
    if (!canChangeTheme()) {
      return;
    }

    let currentThemeMode = getThemeMode();
    let isDarkTheme;
    switch (currentThemeMode) {
      case 0:
        isDarkTheme = false;
        break;
      case 1:
        isDarkTheme = true;
        break;
      default:
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          // The visitor prefers dark themes and switching to the dark variation is allowed by admin.
          isDarkTheme = true;
        } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
          // The visitor prefers dark themes and switching to the dark variation is allowed by admin.
          isDarkTheme = false;
        } else {
          // Use the site's default theme variation based on `light` in the theme file.
          isDarkTheme = isSiteThemeDark;
        }
        break;
    }
    if (isDarkTheme) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }

  // Initialize theme variation.
  initThemeVariation();
})();
