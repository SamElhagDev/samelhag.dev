window.siteInterop = {
    /**
     * Polls for KaTeX to be loaded, then renders all math delimiters on the page.
     * Also renders the Nusselt correlation formula if the target element exists.
     * Returns a promise that resolves once rendering is complete.
     */
    waitForKatexThenRender: function () {
        return new Promise(function (resolve) {
            (function check() {
                if (typeof renderMathInElement !== 'function' || typeof katex === 'undefined') {
                    setTimeout(check, 100);
                    return;
                }

                renderMathInElement(document.body, {
                    delimiters: [
                        { left: '$$', right: '$$', display: true },
                        { left: '$', right: '$', display: false }
                    ],
                    throwOnError: false
                });

                var nusseltEl = document.getElementById('nusseltFormula');
                if (nusseltEl && !nusseltEl.hasChildNodes()) {
                    katex.render(
                        "Nu = \\begin{cases} "
                        + "\\underbrace{0.664 \\, Re^{1/2} \\, Pr^{1/3}}_{\\text{Laminar (Blasius solution)}} "
                        + "& Re < 5 \\times 10^5 \\\\ "
                        + "\\underbrace{0.037 \\, Re^{4/5} \\, Pr^{1/3}}_{\\text{Turbulent (Dittus-Boelter type)}} "
                        + "& Re \\geq 5 \\times 10^5 \\end{cases}",
                        nusseltEl,
                        { displayMode: true, throwOnError: false }
                    );
                }

                resolve(true);
            })();
        });
    }
};
