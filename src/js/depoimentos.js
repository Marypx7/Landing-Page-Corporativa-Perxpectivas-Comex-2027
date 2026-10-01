
function criarLoopDepoimentos() {
    const compat = window.__pxpCompat || {
        raf: window.requestAnimationFrame || ((callback) => setTimeout(callback, 16)),
        prefersReduced: !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches),
        hasResizeObserver: 'ResizeObserver' in window,
    };

    const container = document.querySelector(
        "#depoimentos .dep_content"
    );

    if (!container) return;

    if (container.dataset.loopCriado === "true") return;

    container.dataset.loopCriado = "true";

    const depoimentos = Array.prototype.filter.call(
        container.children,
        (child) => child && child.classList && child.classList.contains('dep_node')
    );

    if (!depoimentos.length) return;

    const viewport = document.createElement("div");
    const track = document.createElement("div");
    const grupoOriginal = document.createElement("div");
    const grupoDuplicado = document.createElement("div");

    viewport.className = "depoimentos_viewport";
    track.className = "depoimentos_track";
    grupoOriginal.className = "depoimentos_group";
    grupoDuplicado.className = "depoimentos_group";

    container.insertBefore(viewport, depoimentos[0]);
    viewport.appendChild(track);
    track.appendChild(grupoOriginal);

    depoimentos.forEach((depoimento) => {
        grupoOriginal.appendChild(depoimento);
    });

    Array.from(grupoOriginal.childNodes).forEach((node) => {
        grupoDuplicado.appendChild(node.cloneNode(true));
    });
    track.appendChild(grupoDuplicado);

    const todosOsCartoes = track.querySelectorAll(".dep_node");

    todosOsCartoes.forEach((cartao) => {
        cartao.addEventListener("mouseenter", () => {
            track.style.animationPlayState = "paused";
        });

        cartao.addEventListener("mouseleave", () => {
            track.style.animationPlayState = "running";
        });

        cartao.addEventListener("focusin", () => {
            track.style.animationPlayState = "paused";
        });

        cartao.addEventListener("focusout", () => {
            track.style.animationPlayState = "running";
        });
    });

    const prefersReduced = compat.prefersReduced || compat.lowPower;

    function ajustarAnimacao() {
        if (prefersReduced) {
            track.style.setProperty('--depoimentos-duration', '220s');
            return;
        }

        const larguraGrupo = grupoOriginal.getBoundingClientRect().width;
        if (!larguraGrupo || !isFinite(larguraGrupo)) return;

        const velocidade = 25;
        const duracao = Math.max(20, Math.round(larguraGrupo / velocidade));

        track.style.setProperty('--depoimentos-duration', `${duracao}s`);
    }

    compat.raf(() => {
        ajustarAnimacao();
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(ajustarAnimacao);
        }
    });

    if (compat.hasResizeObserver && typeof ResizeObserver === 'function') {
        const ro = new ResizeObserver(ajustarAnimacao);
        ro.observe(track);
        ro.observe(grupoOriginal);
        ro.observe(grupoDuplicado);
    } else {
        window.addEventListener('resize', ajustarAnimacao, { passive: true });
    }
}