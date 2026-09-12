(function () {
  'use strict';

  // Inner markup for 24×24 SVG icons, copied from MudBlazor's icon set (Material Outlined and
  // brand marks) so the palette needs no icon font.
  var ICONS = {
    home:     '<path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/>',
    person:   '<path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>',
    explore:  '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z"/>',
    folder:   '<path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>',
    email:    '<path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/>',
    air:      '<path d="M14.5,17c0,1.65-1.35,3-3,3s-3-1.35-3-3h2c0,0.55,0.45,1,1,1s1-0.45,1-1s-0.45-1-1-1H2v-2h9.5 C13.15,14,14.5,15.35,14.5,17z M19,6.5C19,4.57,17.43,3,15.5,3S12,4.57,12,6.5h2C14,5.67,14.67,5,15.5,5S17,5.67,17,6.5 S16.33,8,15.5,8H2v2h13.5C17.43,10,19,8.43,19,6.5z M18.5,11H2v2h16.5c0.83,0,1.5,0.67,1.5,1.5S19.33,16,18.5,16v2 c1.93,0,3.5-1.57,3.5-3.5S20.43,11,18.5,11z"/>',
    play:     '<path d="M10 8.64L15.27 12 10 15.36V8.64M8 5v14l11-7L8 5z"/>',
    github:   '<path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8 0 3.2.9.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1 .9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3"/>',
    linkedin: '<path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>',
    x:        '<path d="M18.625 1.985h3.532l-7.754 8.828 9.058 11.975h-7.106l-5.565-7.278-6.373 7.278H.885l8.214-9.442L.427 1.985H7.71l5.028 6.651 5.887-6.651zM17.39 20.714h1.956L6.683 3.981H4.58l12.81 16.733z"/>',
    at:       '<path d="M12 1.95c-5.52 0-10 4.48-10 10s4.48 10 10 10h5v-2h-5c-4.34 0-8-3.66-8-8s3.66-8 8-8 8 3.66 8 8v1.43c0 .79-.71 1.57-1.5 1.57s-1.5-.78-1.5-1.57v-1.43c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5c1.38 0 2.64-.56 3.54-1.47.65.89 1.77 1.47 2.96 1.47 1.97 0 3.5-1.6 3.5-3.57v-1.43c0-5.52-4.48-10-10-10zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>',
    search:   '<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>'
  };

  // ── Action definitions (11) ──
  var ACTIONS = [
    { label: 'Home',                       type: 'nav',      value: '/',                       hint: 'Page',     icon: 'home' },
    { label: 'About',                      type: 'nav',      value: '/about',                  hint: 'Page',     icon: 'person' },
    { label: 'Interests',                  type: 'nav',      value: '/interests',              hint: 'Page',     icon: 'explore' },
    { label: 'Projects',                   type: 'nav',      value: '/projects',               hint: 'Page',     icon: 'folder' },
    { label: 'Contact',                    type: 'nav',      value: '/contact',                hint: 'Page',     icon: 'email' },
    { label: 'Heat Transfer — Case Study', type: 'nav',      value: '/projects/heat-transfer', hint: 'Project',  icon: 'air' },
    { label: 'Heat Transfer — Live Sim',   type: 'nav',      value: '/heatsimulation',         hint: 'Project',  icon: 'play' },
    { label: 'GitHub',                     type: 'external', value: 'https://github.com/SamElhagDev',                   hint: 'External', icon: 'github' },
    { label: 'LinkedIn',                   type: 'external', value: 'https://www.linkedin.com/in/sam-elhag-b82312102/', hint: 'External', icon: 'linkedin' },
    { label: 'X (Twitter)',                type: 'external', value: 'https://x.com/SamEElhag',                          hint: 'External', icon: 'x' },
    { label: 'Copy email address',         type: 'copy',     value: 'sami.eltaj.elhag@gmail.com',                       hint: 'Utility',  icon: 'at' }
  ];

  var isMac = /Mac|iPhone|iPad/.test((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '');

  // The header keycap shows ⌘K or Ctrl K based on this class. <html> is outside Blazor's render
  // tree, so the choice survives the prerender → interactive re-render without polling.
  if (isMac) document.documentElement.classList.add('is-mac');

  var overlay = null, input = null, list = null;
  var rows = [], activeIndex = 0, lastFocused = null, isOpen = false;

  function icon(name, className) {
    return '<svg class="' + className + '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">' + ICONS[name] + '</svg>';
  }

  // ── Fuzzy subsequence match: score, or -1 if not all chars matched ──
  function fuzzyScore(query, text) {
    if (!query) return 0;
    query = query.toLowerCase(); text = text.toLowerCase();
    var qi = 0, score = 0, streak = 0, firstIndex = -1;
    for (var ti = 0; ti < text.length && qi < query.length; ti++) {
      if (text[ti] === query[qi]) {
        if (firstIndex < 0) firstIndex = ti;
        streak++; score += streak; qi++;
      } else { streak = 0; }
    }
    if (qi < query.length) return -1;
    return score - firstIndex * 0.1;
  }

  function build() {
    overlay = document.createElement('div');
    overlay.className = 'cmdk-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Command palette');
    overlay.hidden = true;

    var panel = document.createElement('div');
    panel.className = 'cmdk-panel';

    var inputWrap = document.createElement('div');
    inputWrap.className = 'cmdk-input-wrap';
    inputWrap.innerHTML = icon('search', 'cmdk-search-icon');
    input = document.createElement('input');
    input.className = 'cmdk-input';
    input.type = 'text';
    input.setAttribute('placeholder', 'Jump to…  (type to filter)');
    input.setAttribute('aria-label', 'Search commands');
    input.autocomplete = 'off';
    input.spellcheck = false;
    inputWrap.appendChild(input);

    list = document.createElement('ul');
    list.className = 'cmdk-list';
    list.setAttribute('role', 'listbox');

    var footer = document.createElement('div');
    footer.className = 'cmdk-footer';
    footer.innerHTML =
      '<span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>' +
      '<span><kbd>↵</kbd> select</span>' +
      '<span><kbd>esc</kbd> close</span>';

    panel.appendChild(inputWrap);
    panel.appendChild(list);
    panel.appendChild(footer);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) close(); });
    input.addEventListener('input', function () { render(input.value); });
    input.addEventListener('keydown', onInputKeydown);
  }

  function render(query) {
    query = query || '';
    var scored = [];
    for (var i = 0; i < ACTIONS.length; i++) {
      var s = fuzzyScore(query, ACTIONS[i].label);
      if (s >= 0) scored.push({ action: ACTIONS[i], score: s });
    }
    if (query) scored.sort(function (a, b) { return b.score - a.score; });

    list.innerHTML = '';
    rows = [];
    if (scored.length === 0) {
      var empty = document.createElement('li');
      empty.className = 'cmdk-empty';
      empty.textContent = 'No matches';
      list.appendChild(empty);
      return;
    }
    for (var j = 0; j < scored.length; j++) {
      (function (idx, action) {
        var li = document.createElement('li');
        li.className = 'cmdk-row';
        li.setAttribute('role', 'option');
        li.innerHTML =
          icon(action.icon, 'cmdk-row-icon') +
          '<span class="cmdk-row-label"></span>' +
          '<span class="cmdk-row-hint"></span>';
        li.querySelector('.cmdk-row-label').textContent = action.label;
        li.querySelector('.cmdk-row-hint').textContent = action.hint || '';
        li.addEventListener('mousemove', function () { setActive(idx); });
        li.addEventListener('click', function () { runAction(action, li); });
        list.appendChild(li);
        rows.push({ action: action, el: li });
      })(j, scored[j].action);
    }
    activeIndex = 0;
    paintActive();
  }

  function paintActive() {
    for (var i = 0; i < rows.length; i++) {
      var on = (i === activeIndex);
      rows[i].el.classList.toggle('cmdk-row--active', on);
      rows[i].el.setAttribute('aria-selected', on ? 'true' : 'false');
    }
    if (rows[activeIndex]) rows[activeIndex].el.scrollIntoView({ block: 'nearest' });
  }

  function setActive(i) { if (i >= 0 && i < rows.length) { activeIndex = i; paintActive(); } }

  function onInputKeydown(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (rows.length) setActive((activeIndex + 1) % rows.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (rows.length) setActive((activeIndex - 1 + rows.length) % rows.length); }
    else if (e.key === 'Enter') { e.preventDefault(); if (rows[activeIndex]) runAction(rows[activeIndex].action, rows[activeIndex].el); }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'Tab') { e.preventDefault(); } // keep focus within the palette
  }

  function runAction(action, el) {
    if (action.type === 'nav') {
      close();
      // A synthetic link click lets Blazor's router handle the navigation client-side.
      var a = document.createElement('a');
      a.href = action.value;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (action.type === 'external') {
      window.open(action.value, '_blank', 'noopener');
      close();
    } else if (action.type === 'copy') {
      var done = function () {
        if (el) {
          var hint = el.querySelector('.cmdk-row-hint');
          if (hint) hint.textContent = 'Copied!';
          el.classList.add('cmdk-row--copied');
        }
        setTimeout(close, 650);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(action.value).then(done, done);
      } else { done(); }
    }
  }

  function open() {
    // The overlay is appended to <body> outside Blazor's render tree. Rebuild it if anything
    // ever detached it, and reconcile stale open-state.
    if (!overlay || !document.body.contains(overlay)) { overlay = null; isOpen = false; build(); }
    if (isOpen) return;
    lastFocused = document.activeElement;
    isOpen = true;
    overlay.hidden = false;
    requestAnimationFrame(function () { overlay.classList.add('cmdk-overlay--open'); });
    input.value = '';
    render('');
    input.focus();
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    overlay.classList.remove('cmdk-overlay--open');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { overlay.hidden = true; } else { setTimeout(function () { if (!isOpen) overlay.hidden = true; }, 180); }
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function toggle() { if (isOpen) close(); else open(); }

  // ── Global trigger: Cmd/Ctrl + K (page-focus only) ──
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      toggle();
    }
  });
  window.commandPalette = { open: open, close: close, toggle: toggle, isMac: isMac };

  document.addEventListener('click', function (e) {
    var t = e.target;
    var trigger = (t && t.closest) ? t.closest('.cmdk-trigger') : null;
    if (trigger) { e.preventDefault(); toggle(); }
  });
})();
