(function () {
    const root = window;
    const doc = document;

    const raf = root.requestAnimationFrame
        ? root.requestAnimationFrame.bind(root)
        : function (callback) {
            return setTimeout(callback, 16);
        };

    const caf = root.cancelAnimationFrame
        ? root.cancelAnimationFrame.bind(root)
        : clearTimeout;

    const prefersReduced = !!(
        root.matchMedia &&
        root.matchMedia('(prefers-reduced-motion: reduce)').matches
    );

    const userAgent = root.navigator && root.navigator.userAgent ? root.navigator.userAgent : '';
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
    const isSafari = /Safari/i.test(userAgent) && !/Chrome|CriOS|Android/i.test(userAgent);
    const width = root.innerWidth || 0;
    const hardware = root.navigator && root.navigator.hardwareConcurrency ? root.navigator.hardwareConcurrency : 0;
    const memory = root.navigator && root.navigator.deviceMemory ? root.navigator.deviceMemory : 0;

    const lowPower = !!(
        prefersReduced ||
        (memory && memory <= 4) ||
        (hardware && hardware <= 4) ||
        (width && width <= 480) ||
        (isIOS && isSafari)
    );

    let passiveSupported = false;
    try {
        const options = Object.defineProperty({}, 'passive', {
            get() {
                passiveSupported = true;
                return true;
            }
        });

        root.addEventListener('test', () => {}, options);
        root.removeEventListener('test', () => {}, options);
    } catch (error) {
        passiveSupported = false;
    }

    root.__pxpCompat = {
        raf,
        caf,
        prefersReduced,
        lowPower,
        passiveSupported,
        hasIntersectionObserver: 'IntersectionObserver' in root,
        hasResizeObserver: 'ResizeObserver' in root,
    };

    if (doc.body) {
        doc.body.classList.toggle('low-power', lowPower);
    }

    if (doc.documentElement) {
        doc.documentElement.classList.toggle('low-power', lowPower);
        doc.documentElement.classList.toggle('reduced-motion', prefersReduced);
    }
})();
