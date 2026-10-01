document.addEventListener("DOMContentLoaded", () => {
    const counters = Array.from(document.querySelectorAll(".item_dados span[data-target]"));

    if (!counters.length) return;

    const compat = window.__pxpCompat || {
        raf: window.requestAnimationFrame || ((callback) => setTimeout(callback, 16)),
        hasIntersectionObserver: 'IntersectionObserver' in window,
    };

    const formatValue = (value, decimals, prefix, suffix) => {
        const numeric = Number(value).toFixed(decimals);
        const localized = decimals > 0 ? numeric.replace(".", ",") : String(Math.round(value));
        return `${prefix}${localized}${suffix}`;
    };

    const setValue = (element, value) => {
        const decimals = Number(element.dataset.decimals || 0);
        const prefix = element.dataset.prefix || "";
        const suffix = element.dataset.suffix || "";
        element.textContent = formatValue(value, decimals, prefix, suffix);
    };

    const resetCounters = () => {
        counters.forEach((element) => {
            element.dataset.animating = "false";
            setValue(element, 0);
        });
    };

    const animateCounter = (element) => {
        if (element.dataset.animating === "true") return;

        element.dataset.animating = "true";

        const target = Number(element.dataset.target || 0);
        const duration = 7000;
        const start = performance.now();

        const update = (timestamp) => {
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentValue = target * eased;

            setValue(element, currentValue);

            if (progress < 1) {
                compat.raf(update);
                return;
            }

            setValue(element, target);
            element.dataset.animating = "false";
        };

        compat.raf(update);
    };

    const startCounters = () => {
        resetCounters();
        compat.raf(() => {
            counters.forEach((counter) => animateCounter(counter));
        });
    };

    const targetSection = document.querySelector(".dados_content");

    if (compat.hasIntersectionObserver && typeof IntersectionObserver === "function" && targetSection) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        startCounters();
                        return;
                    }

                    resetCounters();
                });
            },
            {
                threshold: 0.35,
            }
        );

        observer.observe(targetSection);
        return;
    }

    startCounters();
});
