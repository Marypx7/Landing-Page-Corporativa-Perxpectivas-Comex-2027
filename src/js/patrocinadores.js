document.addEventListener("DOMContentLoaded", () => {
    criarLoopPatrocinadores();
    criarLoopDepoimentos();
});

/* =========================
   LOOP DOS PATROCINADORES
========================= */

function criarLoopPatrocinadores() {
    const compat = window.__pxpCompat || {
        raf: window.requestAnimationFrame || ((callback) => setTimeout(callback, 16)),
        prefersReduced: !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches),
        hasResizeObserver: 'ResizeObserver' in window,
    };

    const viewports = document.querySelectorAll(".patrocinadores");

    if (!viewports.length) return;

    viewports.forEach((viewport) => {
        if (viewport.dataset.loopCriado === "true") return;

        viewport.dataset.loopCriado = "true";

        const patrocinadores = Array.from(viewport.children);

        if (!patrocinadores.length) return;

        const track = document.createElement("div");
        const grupoOriginal = document.createElement("div");
        const grupoDuplicado = document.createElement("div");

        track.className = "patrocinadores_track";
        grupoOriginal.className = "patrocinadores_group";
        grupoDuplicado.className = "patrocinadores_group";

        const modelos = patrocinadores.map((patrocinador) =>
            patrocinador.cloneNode(true)
        );

        patrocinadores.forEach((patrocinador) => {
            grupoOriginal.appendChild(patrocinador);
        });

        track.appendChild(grupoOriginal);
        viewport.appendChild(track);

        if (modelos.length <= 1) {
            track.style.animation = "none";
            grupoOriginal.style.justifyContent = "center";
            return;
        }

        function preencherGrupo() {
            const larguraMinima = viewport.clientWidth + 300;
            let indice = 0;

            while (
                grupoOriginal.scrollWidth < larguraMinima &&
                indice < 30
            ) {
                const modelo = modelos[indice % modelos.length];

                grupoOriginal.appendChild(
                    modelo.cloneNode(true)
                );

                indice++;
            }

            Array.from(grupoOriginal.childNodes).forEach((node) => {
                grupoDuplicado.appendChild(node.cloneNode(true));
            });
            track.appendChild(grupoDuplicado);
        }

        compat.raf(preencherGrupo);

        function configurarAnimacaoEInteracoes() {
            const trackEl = track;
            const grupoEl = grupoOriginal;
            const prefersReduced = compat.prefersReduced || compat.lowPower;

            function ajustar() {
                if (prefersReduced) {
                    trackEl.style.setProperty('--patrocinadores-duration', '220s');
                    return;
                }

                const largura = grupoEl.getBoundingClientRect().width;
                if (!largura || !isFinite(largura)) return;

                const velocidade = 30;
                const duracao = Math.max(20, Math.round(largura / velocidade));
                trackEl.style.setProperty('--patrocinadores-duration', `${duracao}s`);
            }

            const itens = trackEl.querySelectorAll('.patrocinadores_group > *');
            itens.forEach((item) => {
                item.addEventListener('mouseenter', () => trackEl.style.animationPlayState = 'paused');
                item.addEventListener('mouseleave', () => trackEl.style.animationPlayState = 'running');
                item.addEventListener('focusin', () => trackEl.style.animationPlayState = 'paused');
                item.addEventListener('focusout', () => trackEl.style.animationPlayState = 'running');

                item.addEventListener('click', () => {
                    const sel = item.classList.toggle('patrocinador--selected');
                    if (sel) trackEl.style.animationPlayState = 'paused';
                    else trackEl.style.animationPlayState = 'running';
                });
            });

            document.addEventListener('click', (e) => {
                const target = e.target;
                if (!(target instanceof Element)) return;
                if (!target.closest || !target.closest('.patrocinadores_group > *')) {
                    let algum = false;
                    itens.forEach((it) => {
                        if (it.classList.contains('patrocinador--selected')) algum = true;
                        it.classList.remove('patrocinador--selected');
                    });
                    if (algum) trackEl.style.animationPlayState = 'running';
                }
            });

            if (compat.hasResizeObserver && typeof ResizeObserver === 'function') {
                const ro = new ResizeObserver(ajustar);
                ro.observe(trackEl);
                ro.observe(grupoEl);
            } else {
                window.addEventListener('resize', ajustar, { passive: true });
            }

            compat.raf(() => {
                ajustar();
                if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajustar);
            });
        }

        compat.raf(configurarAnimacaoEInteracoes);
    });
}