/* SKILL Lab interactions. Everything degrades gracefully: without JS the content is fully visible. */
(function ($) {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var body = document.body;

  function store(key, value) {
    try {
      if (value === undefined) return window.sessionStorage.getItem(key);
      window.sessionStorage.setItem(key, value);
    } catch (e) { return null; }
  }

  /* ---------- Theme toggle: light → dark → follow system ---------- */
  function themeIcon(mode) {
    var icon = mode === 0 ? 'fa-sun' : (mode === 1 ? 'fa-moon' : 'fa-circle-half-stroke fa-adjust');
    var title = mode === 0 ? 'Light theme (click to switch)' : (mode === 1 ? 'Dark theme (click to switch)' : 'System theme (click to switch)');
    $('.js-toggle-theme').attr('title', title).find('i').attr('class', 'fas ' + icon);
  }
  themeIcon(parseInt(localStorage.getItem('dark_mode') || '0', 10));
  $('.js-toggle-theme').on('click', function (e) {
    e.preventDefault();
    var next = (parseInt(localStorage.getItem('dark_mode') || '0', 10) + 1) % 3;
    localStorage.setItem('dark_mode', String(next));
    $(['.js-set-theme-light', '.js-set-theme-dark', '.js-set-theme-auto'][next]).trigger('click');
    themeIcon(next);
  });

  // Hero letters animate in once the page is ready.
  window.requestAnimationFrame(function () { body.classList.add('sk-ready'); });

  /* ---------- Navbar, drawer, scroll progress ---------- */
  var nav = document.querySelector('.sk-nav');
  var progress = document.querySelector('.sk-progress');
  function onScroll() {
    var y = window.scrollY;
    if (nav) nav.classList.toggle('is-scrolled', y > 24);
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    body.classList.toggle('sk-menu-open', open);
    $('.sk-burger').attr('aria-expanded', open ? 'true' : 'false');
    $('#sk-drawer').attr('aria-hidden', open ? 'false' : 'true');
  }
  $('.sk-burger').on('click', function () { setMenu(!body.classList.contains('sk-menu-open')); });
  $('#sk-drawer a').on('click', function () { setMenu(false); });

  // Dropdowns open on click and close on an outside click, Escape, or following a link.
  function closeSubmenus(except) {
    $('.sk-menu-toggle').not(except).attr('aria-expanded', 'false');
  }
  $('.sk-menu-toggle').on('click', function (e) {
    e.stopPropagation();
    var open = this.getAttribute('aria-expanded') === 'true';
    closeSubmenus(this);
    this.setAttribute('aria-expanded', open ? 'false' : 'true');
  });
  $('.sk-submenu a').on('click', function () { closeSubmenus(); });
  $(document).on('click', function (e) { if (!$(e.target).closest('.sk-submenu').length) closeSubmenus(); });
  $(document).on('keydown', function (e) { if (e.key === 'Escape') { setMenu(false); closeSubmenus(); } });

  /* ---------- Themed canvas backgrounds ----------
     data-scene: graph (knowledge graph with facts travelling along edges),
     clusters (data mining: scattered points settle into groups),
     reasoning (a path is checked hop by hop, wrong branches are rejected),
     alignment (arrows turn to agree; they follow the cursor when it is near). */
  function Scene(canvas) {
    var ctx = canvas.getContext('2d');
    var kind = canvas.dataset.scene || 'graph';
    var density = parseFloat(canvas.dataset.density || '1');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var LOOP = kind === 'clusters' ? 11000 : 12000;
    var w = 0, h = 0, nodes = [], edges = [], pulses = [], centers = [], path = [];
    var cols = 0, clock = 0, last = 0, running = false, mouse = null, color = '126,12,110';

    function readColor() { color = getComputedStyle(body).getPropertyValue('--node').trim() || color; }
    function rgba(a) { return 'rgba(' + color + ',' + a.toFixed(3) + ')'; }
    function gauss() { return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5; }

    function layout() {
      var rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.max(16, Math.round(Math.min(90, (w * h) / 13000) * density));
      nodes = []; edges = []; pulses = [];
      var i;
      for (i = 0; i < count; i++) {
        nodes.push({ x: Math.random() * w, y: Math.random() * h, hx: 0, hy: 0, seed: Math.random() * 6.28, a: Math.random() * 6.28, delay: Math.random() });
      }
      centers = [[.14, .3], [.86, .26], [.2, .78], [.8, .76], [.62, .14]].map(function (c) { return { x: c[0] * w, y: c[1] * h }; });
      if (kind === 'graph') layoutGraph();
      else if (kind === 'clusters') layoutClusters();
      else if (kind === 'reasoning') layoutReasoning();
      else layoutArrows();
      readColor();
      if (reduceMotion) { clock = LOOP * .7; nodes.forEach(function (n) { n.x = n.hx; n.y = n.hy; }); }
      if (!running) draw();
    }

    function layoutGraph() {
      var r = Math.min(w * .11, h * .24);
      nodes.forEach(function (n, i) {
        var c = centers[i % centers.length];
        n.c = i % centers.length;
        n.hx = c.x + gauss() * r * 1.5; n.hy = c.y + gauss() * r;
      });
      nodes.forEach(function (n, i) {
        var best = nodes.map(function (m, j) { return { j: j, d: Math.pow(m.hx - n.hx, 2) + Math.pow(m.hy - n.hy, 2) }; })
          .filter(function (o) { return o.j !== i && nodes[o.j].c === n.c; })
          .sort(function (a, b) { return a.d - b.d; }).slice(0, 2);
        best.forEach(function (o) { edges.push([i, o.j]); });
      });
      for (var c = 0; c < centers.length - 1; c++) edges.push([c, c + 1]);
      for (var p = 0; p < 7; p++) pulses.push({ e: Math.floor(Math.random() * edges.length), t: Math.random() });
    }

    function layoutClusters() {
      nodes.forEach(function (n, i) {
        n.c = i % 4;
        n.sx = Math.random() * w; n.sy = Math.random() * h;
        n.ox = gauss() * Math.min(w * .08, h * .2); n.oy = gauss() * Math.min(w * .08, h * .2);
        n.hx = centers[n.c].x + n.ox; n.hy = centers[n.c].y + n.oy;
      });
    }

    function layoutReasoning() {
      cols = Math.min(7, Math.floor(nodes.length / 3));
      var rows = [.24, .52, .8];
      nodes.forEach(function (n, i) {
        if (i < cols * 3) {
          n.col = Math.floor(i / 3); n.row = i % 3;
          n.hx = w * (.06 + .88 * n.col / (cols - 1)); n.hy = h * rows[n.row];
        } else { n.col = -1; n.hx = Math.random() * w; n.hy = Math.random() * h; }
      });
      path = [];
      for (var c = 0; c < cols; c++) path.push((c * 2 + 1) % 3);
    }

    function layoutArrows() {
      var gc = Math.max(4, Math.round(Math.sqrt(nodes.length * w / Math.max(h, 1))));
      var gr = Math.ceil(nodes.length / gc);
      nodes.forEach(function (n, i) {
        n.hx = w * ((i % gc) + .5) / gc; n.hy = h * (Math.floor(i / gc) + .5) / gr;
        n.x = n.hx; n.y = n.hy;
      });
    }

    function drawDots(alpha, r) {
      ctx.fillStyle = rgba(alpha);
      nodes.forEach(function (n) { ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, 6.29); ctx.fill(); });
    }

    function drawGraph(dt) {
      ctx.lineWidth = .8;
      ctx.strokeStyle = rgba(.2);
      edges.forEach(function (e) { ctx.beginPath(); ctx.moveTo(nodes[e[0]].x, nodes[e[0]].y); ctx.lineTo(nodes[e[1]].x, nodes[e[1]].y); ctx.stroke(); });
      drawDots(.5, 2);
      pulses.forEach(function (p) {
        p.t += dt / 1800;
        if (p.t > 1) { p.t = 0; p.e = Math.floor(Math.random() * edges.length); }
        var a = nodes[edges[p.e][0]], b = nodes[edges[p.e][1]];
        ctx.fillStyle = rgba(.85 * Math.sin(p.t * 3.14));
        ctx.beginPath(); ctx.arc(a.x + (b.x - a.x) * p.t, a.y + (b.y - a.y) * p.t, 3, 0, 6.29); ctx.fill();
      });
    }

    function drawClusters() {
      var f = Math.max(0, Math.min(1, (clock - 1500) / 2500));
      f = f * f * (3 - 2 * f);
      nodes.forEach(function (n) {
        n.hx = n.sx + (centers[n.c].x + n.ox - n.sx) * f;
        n.hy = n.sy + (centers[n.c].y + n.oy - n.sy) * f;
      });
      if (f > 0) {
        ctx.lineWidth = .7;
        ctx.strokeStyle = rgba(.16 * f);
        nodes.forEach(function (n) { ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(centers[n.c].x, centers[n.c].y); ctx.stroke(); });
        ctx.setLineDash([3, 6]);
        ctx.lineDashOffset = -clock / 60;
        ctx.strokeStyle = rgba(.45 * f);
        for (var c = 0; c < 4; c++) {
          ctx.beginPath(); ctx.arc(centers[c].x, centers[c].y, Math.min(w * .08, h * .2) * 1.15 * f, 0, 6.29); ctx.stroke();
        }
        ctx.setLineDash([]);
      }
      drawDots(.55, 2);
    }

    function nodeAt(col, row) { return nodes[col * 3 + row]; }

    function drawReasoning() {
      var p = Math.min(cols - 1, clock / (LOOP * .75) * (cols - 1));
      var c, r, s;
      ctx.lineWidth = .7;
      ctx.strokeStyle = rgba(.12);
      for (c = 0; c < cols - 1; c++) for (r = 0; r < 3; r++) for (s = 0; s < 3; s++) {
        ctx.beginPath(); ctx.moveTo(nodeAt(c, r).x, nodeAt(c, r).y); ctx.lineTo(nodeAt(c + 1, s).x, nodeAt(c + 1, s).y); ctx.stroke();
      }
      ctx.lineWidth = 2;
      ctx.strokeStyle = rgba(.8);
      for (c = 0; c < Math.ceil(p) && c < cols - 1; c++) {
        var a = nodeAt(c, path[c]), b = nodeAt(c + 1, path[c + 1]), q = Math.min(1, p - c);
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(a.x + (b.x - a.x) * q, a.y + (b.y - a.y) * q); ctx.stroke();
      }
      nodes.forEach(function (n) {
        if (n.col < 0) { return; }
        var onPath = path[n.col] === n.row && n.col <= p;
        var rejected = path[n.col] !== n.row && n.row === (path[n.col] + 1) % 3 && n.col <= p;
        ctx.fillStyle = rgba(onPath ? .9 : (rejected ? .12 : .35));
        ctx.beginPath(); ctx.arc(n.x, n.y, onPath ? 6 : 3, 0, 6.29); ctx.fill();
        ctx.lineWidth = 1.5;
        if (onPath) {
          ctx.strokeStyle = 'rgba(255,255,255,.95)';
          ctx.beginPath(); ctx.moveTo(n.x - 3, n.y); ctx.lineTo(n.x - 1, n.y + 2.2); ctx.lineTo(n.x + 3, n.y - 2.2); ctx.stroke();
        } else if (rejected) {
          ctx.strokeStyle = rgba(.4);
          ctx.beginPath(); ctx.moveTo(n.x - 4, n.y - 4); ctx.lineTo(n.x + 4, n.y + 4); ctx.moveTo(n.x + 4, n.y - 4); ctx.lineTo(n.x - 4, n.y + 4); ctx.stroke();
        }
      });
    }

    function drawArrows(dt) {
      var f = Math.max(0, Math.min(1, clock / (LOOP * .6)));
      ctx.lineWidth = 1.3;
      nodes.forEach(function (n) {
        var goal = mouse ? Math.atan2(mouse.y - n.y, mouse.x - n.x) : -.6;
        var local = mouse ? 1 : Math.max(0, Math.min(1, (f - n.delay * .5) * 2));
        var diff = Math.atan2(Math.sin(goal - n.a), Math.cos(goal - n.a));
        n.a += diff * local * Math.min(1, dt / 500);
        var ax = Math.cos(n.a), ay = Math.sin(n.a), len = 9;
        var agree = 1 - Math.abs(diff) / 3.15;
        ctx.strokeStyle = rgba(.15 + .5 * agree);
        ctx.beginPath();
        ctx.moveTo(n.x - ax * len, n.y - ay * len);
        ctx.lineTo(n.x + ax * len, n.y + ay * len);
        ctx.moveTo(n.x + ax * len - ax * 5 - ay * 3.5, n.y + ay * len - ay * 5 + ax * 3.5);
        ctx.lineTo(n.x + ax * len, n.y + ay * len);
        ctx.lineTo(n.x + ax * len - ax * 5 + ay * 3.5, n.y + ay * len - ay * 5 - ax * 3.5);
        ctx.stroke();
      });
    }

    function draw(now) {
      var dt = now && last ? Math.min(now - last, 50) : 16;
      last = now || 0;
      if (running) {
        clock += dt;
        if (clock > LOOP) {
          clock = 0;
          if (kind === 'clusters') nodes.forEach(function (n) { n.sx = Math.random() * w; n.sy = Math.random() * h; });
          if (kind === 'alignment') nodes.forEach(function (n) { n.a = Math.random() * 6.28; n.delay = Math.random(); });
        }
        readColorThrottled();
        nodes.forEach(function (n) {
          var wob = kind === 'reasoning' ? 0 : 5;
          var tx = n.hx + Math.sin(clock / 1500 + n.seed) * wob, ty = n.hy + Math.cos(clock / 1800 + n.seed) * wob;
          n.x += (tx - n.x) * .05; n.y += (ty - n.y) * .05;
        });
      }
      ctx.clearRect(0, 0, w, h);
      if (kind === 'graph') drawGraph(dt);
      else if (kind === 'clusters') drawClusters();
      else if (kind === 'reasoning') drawReasoning();
      else drawArrows(dt);
      if (running) window.requestAnimationFrame(draw);
    }
    var tick = 0;
    function readColorThrottled() { if (++tick % 45 === 0) readColor(); }

    function start() { if (!running && !reduceMotion) { running = true; last = 0; window.requestAnimationFrame(draw); } }
    function stop() { running = false; }

    if (kind === 'alignment') {
      var host = canvas.parentElement;
      host.addEventListener('pointermove', function (e) { var r = canvas.getBoundingClientRect(); mouse = { x: e.clientX - r.left, y: e.clientY - r.top }; }, { passive: true });
      host.addEventListener('pointerleave', function () { mouse = null; });
    }
    var resizeTimer;
    window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(layout, 150); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) { if (entries[0].isIntersecting) { start(); } else { stop(); } }).observe(canvas);
    } else { start(); }
    document.addEventListener('visibilitychange', function () { if (document.hidden) { stop(); } else { start(); } });
    $('.js-toggle-theme').on('click', function () { window.setTimeout(function () { readColor(); if (!running) draw(); }, 50); });
    layout();
  }
  document.querySelectorAll('.sk-graph').forEach(function (c) { new Scene(c); });

  /* ---------- Reveal on scroll, counters ---------- */
  function countUp(el) {
    var target = parseInt(el.dataset.count, 10);
    if (isNaN(target) || reduceMotion) return;
    var t0 = null;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / 1400);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        entry.target.querySelectorAll('[data-count]').forEach(countUp);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    document.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Typewriter ---------- */
  var typer = document.querySelector('.sk-typer');
  if (typer && !reduceMotion) {
    var words = typer.dataset.words.split('|'), wi = 0, ci = words[0].length, deleting = true;
    var tick = function () {
      var word = words[wi];
      ci += deleting ? -1 : 1;
      typer.textContent = word.slice(0, ci);
      var delay = deleting ? 40 : 90;
      if (!deleting && ci >= word.length) { deleting = true; delay = 2200; }
      else if (deleting && ci <= 0) { deleting = false; wi = (wi + 1) % words.length; delay = 300; }
      window.setTimeout(tick, delay);
    };
    window.setTimeout(tick, 3000);
  }

  /* ---------- Card spotlight ---------- */
  if (finePointer && !reduceMotion) {
    $(document).on('pointermove', '[data-spotlight]', function (e) {
      var r = this.getBoundingClientRect();
      this.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      this.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  }

  /* ---------- Publication filters ---------- */
  $('[data-pubs]').each(function () {
    var $root = $(this), state = { year: 'all', area: 'all', q: '' };
    var params = new URLSearchParams(window.location.search);
    if (params.get('area')) state.area = params.get('area');
    function apply() {
      var shown = 0;
      $root.find('.sk-pub-card').each(function () {
        var ok = (state.year === 'all' || this.dataset.year === state.year) &&
                 (state.area === 'all' || (' ' + this.dataset.area + ' ').indexOf(' ' + state.area + ' ') > -1) &&
                 (!state.q || this.dataset.text.indexOf(state.q) > -1);
        this.classList.toggle('is-hidden', !ok);
        if (ok) { shown++; this.classList.add('is-in'); }
      });
      $root.find('[data-year-group]').each(function () {
        var n = $(this).find('.sk-pub-card:not(.is-hidden)').length;
        $(this).toggle(n > 0).find('[data-year-count]').text(n);
      });
      $root.find('[data-pub-shown]').text(shown);
      $root.find('[data-pub-empty]').prop('hidden', shown > 0);
      $root.find('.sk-filter').each(function () {
        this.classList.toggle('is-active', state[this.dataset.filter] === this.dataset.value);
      });
    }
    $root.on('click', '.sk-filter', function () { state[this.dataset.filter] = this.dataset.value; apply(); });
    $root.on('input', '[data-pub-search]', function () { state.q = this.value.trim().toLowerCase(); apply(); });
    apply();
  });

  /* ---------- People tabs ---------- */
  $('[data-tabs]').each(function () {
    var $tabs = $(this).find('.sk-tab'), $panels = $(this).parent().find('[data-panel]');
    $tabs.on('click', function () {
      var i = this.dataset.tab;
      $tabs.removeClass('is-active').attr('aria-selected', 'false');
      $(this).addClass('is-active').attr('aria-selected', 'true');
      $panels.removeClass('is-active').filter('[data-panel="' + i + '"]').addClass('is-active');
    });
  });

  /* ---------- Live GitHub stats on the open-source page ---------- */
  $('[data-repo]').each(function () {
    var $card = $(this), repo = this.dataset.repo;
    if (repo.indexOf('/') < 0) return;
    var cacheKey = 'gh:' + repo, cached = store(cacheKey);
    function render(data) {
      if (!data || data.stargazers_count === undefined) return;
      $card.find('[data-stat="stars"]').prop('hidden', false).find('b').text(data.stargazers_count);
      $card.find('[data-stat="forks"]').prop('hidden', false).find('b').text(data.forks_count);
    }
    if (cached) { try { render(JSON.parse(cached)); return; } catch (e) { /* refetch */ } }
    $.getJSON('https://api.github.com/repos/' + repo).done(function (data) {
      store(cacheKey, JSON.stringify({ stargazers_count: data.stargazers_count, forks_count: data.forks_count }));
      render(data);
    });
  });

  /* ---------- Back to top ---------- */
  $('.sk-top').on('click', function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });
})(jQuery);
