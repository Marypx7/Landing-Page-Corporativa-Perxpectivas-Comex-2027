document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("video-inicio");
    const fade = document.getElementById("video-fade");

    if (!video || !fade) return;

    const DURACAO_FADE = 1.5;
    const compat = window.__pxpCompat || {
        raf: window.requestAnimationFrame || ((callback) => setTimeout(callback, 16)),
        caf: window.cancelAnimationFrame || clearTimeout,
        prefersReduced: !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches),
        lowPower: false,
    };

    const usarLoopLeve = !!compat.lowPower;
    let rafId = null;

    try {
        video.playbackRate = usarLoopLeve ? 0.5 : 0.7;
    } catch (error) {
        // Safari e browsers mais antigos podem bloquear essa alteração em determinados momentos.
    }

    function pararAnimacaoFade() {
        if (rafId !== null) {
            compat.caf(rafId);
            rafId = null;
        }
    }

    function atualizarFade() {
        if (!video || !fade) return;

        if (!video.duration || video.ended || video.paused) {
            fade.style.opacity = "0";
            return;
        }

        const restante = video.duration - video.currentTime;

        if (restante <= DURACAO_FADE) {
            const opacidade = Math.min(1, 1 - (restante / DURACAO_FADE));
            fade.style.opacity = String(opacidade);
        } else if (video.currentTime <= DURACAO_FADE) {
            const opacidade = Math.max(0, 1 - (video.currentTime / DURACAO_FADE));
            fade.style.opacity = String(opacidade);
        } else {
            fade.style.opacity = "0";
        }
    }

    function animarFade() {
        atualizarFade();

        if (usarLoopLeve) {
            rafId = setTimeout(animarFade, 120);
            return;
        }

        rafId = compat.raf(animarFade);
    }

    function iniciarAnimacaoFade() {
        if (compat.prefersReduced || video.paused || video.ended) {
            fade.style.opacity = "0";
            return;
        }

        pararAnimacaoFade();
        animarFade();
    }

    if (video.readyState >= 1) {
        iniciarAnimacaoFade();
    } else {
        video.addEventListener("loadedmetadata", () => {
            iniciarAnimacaoFade();
        }, { once: true });
    }

    video.addEventListener("play", iniciarAnimacaoFade, { passive: true });
    video.addEventListener("pause", () => {
        fade.style.opacity = "0";
        pararAnimacaoFade();
    }, { passive: true });
    video.addEventListener("ended", () => {
        fade.style.opacity = "1";
        pararAnimacaoFade();
    }, { passive: true });
    video.addEventListener("timeupdate", () => {
        if (usarLoopLeve) {
            atualizarFade();
        }
    }, { passive: true });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            pararAnimacaoFade();
            fade.style.opacity = "0";
            return;
        }

        if (!video.paused && !video.ended) {
            iniciarAnimacaoFade();
        }
    }, { passive: true });
});