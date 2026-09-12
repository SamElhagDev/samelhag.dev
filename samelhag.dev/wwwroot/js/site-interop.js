// Site-wide helpers: skip-link focus handling, and KaTeX loaded on demand for the simulation pages.
(function () {
    'use strict';

    // ── Skip link ──
    // With <base href="/">, a bare "#main-content" link resolves to the home page, so intercept it
    // in the capture phase (ahead of Blazor's router) and move focus into <main> directly.
    document.addEventListener('click', function (e) {
        var link = e.target && e.target.closest ? e.target.closest('a.skip-link') : null;
        var main = link ? document.getElementById('main-content') : null;
        if (!main) return;
        e.preventDefault();
        e.stopPropagation();
        main.focus();
    }, true);

    // ── KaTeX, fetched on first use ──
    // Only the two simulation pages typeset math, so KaTeX (~300 KB with fonts) loads when they
    // ask for it instead of blocking every page's <head>.
    var KATEX_BASE = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/';
    var KATEX_CSS = { file: 'katex.min.css', integrity: 'sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV' };
    var KATEX_JS = { file: 'katex.min.js', integrity: 'sha384-XjKyOOlGwcjNTAIQHIpgOno0Hl1YQqzUOEleOLALmuqehneUG+vnGctmUb0ZY0l8' };
    var AUTO_RENDER_JS = { file: 'contrib/auto-render.min.js', integrity: 'sha384-+VBxd3r6XgURycqtZ117nYw44OOcIax56Z4dCRWbxyPt0Koah1uHoK0o4+/RRE05' };

    var NUSSELT_TEX =
        'Nu = \\begin{cases} ' +
        '\\underbrace{0.664 \\, Re^{1/2} \\, Pr^{1/3}}_{\\text{Laminar (Blasius solution)}} & Re < 5 \\times 10^5 \\\\ ' +
        '\\underbrace{0.037 \\, Re^{4/5} \\, Pr^{1/3}}_{\\text{Turbulent (Dittus-Boelter type)}} & Re \\geq 5 \\times 10^5 ' +
        '\\end{cases}';

    var katexReady = null;

    function load(tag, props) {
        return new Promise(function (resolve, reject) {
            var el = document.createElement(tag);
            Object.keys(props).forEach(function (key) { el[key] = props[key]; });
            el.crossOrigin = 'anonymous';
            el.onload = resolve;
            el.onerror = function () { reject(new Error('Failed to load ' + (props.src || props.href))); };
            document.head.appendChild(el);
        });
    }

    function loadKatex() {
        if (!katexReady) {
            // The stylesheet only affects appearance, so rendering doesn't wait on it.
            load('link', { rel: 'stylesheet', href: KATEX_BASE + KATEX_CSS.file, integrity: KATEX_CSS.integrity })
                .catch(function (err) { console.warn(err); });

            // auto-render depends on the katex global, so the scripts load in sequence.
            katexReady = load('script', { src: KATEX_BASE + KATEX_JS.file, integrity: KATEX_JS.integrity })
                .then(function () { return load('script', { src: KATEX_BASE + AUTO_RENDER_JS.file, integrity: AUTO_RENDER_JS.integrity }); });
            katexReady.catch(function () { katexReady = null; }); // let a later visit retry
        }
        return katexReady;
    }

    function markRendered() {
        var formulas = document.querySelectorAll('.math-formula');
        for (var i = 0; i < formulas.length; i++) formulas[i].setAttribute('data-rendered', '');
    }

    // Typesets every $$…$$ block in <main>, plus the Nusselt correlation on the live-simulation page.
    function renderMath() {
        return loadKatex()
            .then(function () {
                renderMathInElement(document.getElementById('main-content') || document.body, {
                    delimiters: [
                        { left: '$$', right: '$$', display: true },
                        { left: '$', right: '$', display: false }
                    ],
                    throwOnError: false
                });

                var nusselt = document.getElementById('nusseltFormula');
                if (nusselt && !nusselt.hasChildNodes()) {
                    katex.render(NUSSELT_TEX, nusselt, { displayMode: true, throwOnError: false });
                }
            })
            .catch(function (err) { console.warn('KaTeX unavailable; showing raw LaTeX.', err); })
            .then(markRendered);
    }

    window.siteInterop = { renderMath: renderMath };
})();
