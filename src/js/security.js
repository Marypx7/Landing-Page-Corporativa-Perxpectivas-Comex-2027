(function () {
    'use strict';

    function bloquearEmbuticao() {
        try {
            if (window.top !== window.self) {
                window.top.location = 'about:blank';
            }
        } catch (error) {
            // Não permite que a página seja embutida em outro domínio.
        }
    }

    function bloquearAcessoInseguro() {
        const host = location.hostname || '';
        const isLocalFile = location.protocol === 'file:';

        if (!host || isLocalFile) {
            return;
        }

        const forbiddenPatterns = [/^\s*javascript:/i, /^\s*data:/i];

        document.addEventListener('click', (event) => {
            const target = event.target;
            if (!(target instanceof Element)) return;

            const link = target.closest ? target.closest('a') : null;
            if (!link) return;

            const href = link.getAttribute('href') || '';
            if (forbiddenPatterns.some((pattern) => pattern.test(href))) {
                event.preventDefault();
                event.stopPropagation();
            }
        }, { passive: false });
    }

    bloquearEmbuticao();
    bloquearAcessoInseguro();
})();
