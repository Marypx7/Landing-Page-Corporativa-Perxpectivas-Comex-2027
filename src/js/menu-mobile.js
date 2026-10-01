document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.btn-mobile');
    const nav = document.getElementById('nav-links');

    if (!button || !nav) return;

    button.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('show');
        button.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();

            const headerOffset = document.querySelector('.navbar')?.offsetHeight || 90;
            const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;

            window.scrollTo({
                top,
                behavior: 'smooth'
            });

            nav.classList.remove('show');
            button.setAttribute('aria-expanded', 'false');
            history.pushState(null, '', targetId);
        });
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('show');
            button.setAttribute('aria-expanded', 'false');
        });
    });
});
