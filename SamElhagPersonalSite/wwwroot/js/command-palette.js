(function () {
  'use strict';

  // ── Action definitions (11) ──
  var ACTIONS = [
    { label: 'Home',                       type: 'nav',      value: '/',                       hint: 'Page',     icon: 'fa-solid fa-house' },
    { label: 'About',                      type: 'nav',      value: '/about',                  hint: 'Page',     icon: 'fa-solid fa-user' },
    { label: 'Interests',                  type: 'nav',      value: '/interests',              hint: 'Page',     icon: 'fa-solid fa-compass' },
    { label: 'Projects',                   type: 'nav',      value: '/projects',               hint: 'Page',     icon: 'fa-solid fa-folder-open' },
    { label: 'Contact',                    type: 'nav',      value: '/contact',                hint: 'Page',     icon: 'fa-solid fa-envelope' },
    { label: 'Heat Transfer — Case Study', type: 'nav',      value: '/projects/heat-transfer', hint: 'Project',  icon: 'fa-solid fa-wind' },
    { label: 'Heat Transfer — Live Sim',   type: 'nav',      value: '/HeatSimulation',         hint: 'Project',  icon: 'fa-solid fa-play' },
    { label: 'GitHub',                     type: 'external', value: 'https://github.com/SamElhagDev',                   hint: 'External', icon: 'fa-brands fa-github' },
    { label: 'LinkedIn',                   type: 'external', value: 'https://www.linkedin.com/in/sam-elhag-b82312102/', hint: 'External', icon: 'fa-brands fa-linkedin' },
    { label: 'X (Twitter)',                type: 'external', value: 'https://x.com/SamEElhag',                          hint: 'External', icon: 'fa-brands fa-x-twitter' },
    { label: 'Copy email address',         type: 'copy',     value: 'sami.eltaj.elhag@gmail.com',                       hint: 'Utility',  icon: 'fa-solid fa-at' }
  ];

  var isMac = /Mac|iPhone|iPad/.test((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '');

  var overlay = null, input = null, list = null;
  var rows = [], activeIndex = 0, lastFocused = null, isOpen = false;

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
    var searchIcon = document.createElement('i');
    searchIcon.className = 'fa-solid fa-magnifying-glass cmdk-search-icon';
    input = document.createElement('input');
    input.className = 'cmdk-input';
    input.type = 'text';
    input.setAttribute('placeholder', 'Jump to…  (type to filter)');
    input.setAttribute('aria-label', 'Search commands');
    input.autocomplete = 'off';
    input.spellcheck = false;
    inputWrap.appendChild(searchIcon);
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
          '<i class="' + action.icon + ' cmdk-row-icon"></i>' +
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
    // Blazor enhanced navigation morphs the DOM and removes our injected overlay
    // (it has no data-permanent marker). Rebuild it if it was detached, and
    // reconcile stale open-state, so the palette survives client-side navigation.
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

  // Expose for the navbar chip
  window.commandPalette = { open: open, close: close, toggle: toggle, isMac: isMac };

  // Wire the navbar trigger chip(s): set keycap text + click handler
  function wireChips() {
    var triggers = document.querySelectorAll('.cmdk-trigger');
    for (var i = 0; i < triggers.length; i++) {
      var btn = triggers[i];
      var cap = btn.querySelector('[data-cmdk-keycap]');
      if (cap) cap.textContent = isMac ? '⌘K' : 'Ctrl K';
      if (!btn.dataset.cmdkBound) {
        btn.dataset.cmdkBound = '1';
        btn.addEventListener('click', function (e) { e.preventDefault(); toggle(); });
      }
    }
  }

  // Run now + after Blazor interactive render / enhanced navigation (app bar renders after circuit connect)
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wireChips); else wireChips();
  [300, 1000, 2500].forEach(function (t) { setTimeout(wireChips, t); });
  if (window.Blazor) window.Blazor.addEventListener('enhancednavigationend', wireChips);
})();
