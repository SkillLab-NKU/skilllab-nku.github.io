/* 自定义主题切换：浅色 / 深色 / 跟随系统 */
(function ($) {
  function updateToggleIcon(mode) {
    var $btn = $('.js-toggle-theme');
    if (!$btn.length) return;

    // Remove existing icon classes
    $btn.find('i').remove();

    if (mode === 0) {
      // 浅色模式：显示太阳
      $btn.append('<i class="fas fa-sun" aria-hidden="true" style="font-size:1em;color:#7e0c6e;"></i>');
      $btn.attr('title', '浅色模式（点击切换）');
    } else if (mode === 1) {
      // 深色模式：显示月亮
      $btn.append('<i class="fas fa-moon" aria-hidden="true" style="font-size:1em;color:#d989c8;"></i>');
      $btn.attr('title', '深色模式（点击切换）');
    } else {
      // 跟随系统：组合图标
      $btn.append('<i class="fas fa-sun" aria-hidden="true" style="font-size:0.65em;position:absolute;top:0;left:0;opacity:0.85;color:#7e0c6e;"></i><i class="fas fa-moon" aria-hidden="true" style="font-size:0.65em;position:absolute;bottom:0;right:0;opacity:0.85;color:#d989c8;"></i>');
      $btn.attr('title', '跟随系统（点击切换）');
    }
  }

  $(document).ready(function () {
    // Default to light (0) if never set before
    if (localStorage.getItem('dark_mode') === null) {
      localStorage.setItem('dark_mode', '0');
    }

    var mode = parseInt(localStorage.getItem('dark_mode') || '0');
    updateToggleIcon(mode);

    $('.js-toggle-theme').on('click', function (e) {
      e.preventDefault();
      var mode = parseInt(localStorage.getItem('dark_mode') || '0');
      if (mode === 0) {
        // 浅色 -> 深色
        localStorage.setItem('dark_mode', '1');
        $('.js-set-theme-dark').trigger('click');
        updateToggleIcon(1);
      } else if (mode === 1) {
        // 深色 -> 跟随系统
        localStorage.setItem('dark_mode', '2');
        $('.js-set-theme-auto').trigger('click');
        updateToggleIcon(2);
      } else {
        // 跟随系统 -> 浅色
        localStorage.setItem('dark_mode', '0');
        $('.js-set-theme-light').trigger('click');
        updateToggleIcon(0);
      }
    });

    // Research cards follow the THUNLP-style hover flip while remaining usable
    // on touch screens and with a keyboard.
    $('.research-flip-card').on('click', function () {
      var $card = $(this);
      var active = !$card.hasClass('is-flipped');
      $card.toggleClass('is-flipped', active).attr('aria-pressed', active ? 'true' : 'false');
    }).on('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        $(this).trigger('click');
      } else if (e.key === 'Escape') {
        $(this).removeClass('is-flipped').attr('aria-pressed', 'false');
      }
    });

    // Re-apply deep links after fonts and responsive content settle.
    // This prevents a mobile hero reflow from displacing the requested section.
    if (window.location.hash && $(window.location.hash).length) {
      window.setTimeout(function () {
        var $target = $(window.location.hash);
        var navbarHeight = $('#navbar-main').outerHeight() || 0;
        window.scrollTo(0, Math.max(0, $target.offset().top - navbarHeight));
      }, 500);
    }
  });
})(jQuery);
