
document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------------- 1. Nav activo según sección visible ---------------- */

    const navLinks = document.querySelectorAll('.barra_ul a');
    const sections = Array.from(navLinks)
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if (sections.length && navLinks.length) {
        const navObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = `#${entry.target.id}`;
                        navLinks.forEach(link => {
                            link.classList.toggle('active', link.getAttribute('href') === id);
                        });
                    }
                });
            },
            { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
        );

        sections.forEach(section => navObserver.observe(section));
    }

    /* ---------------- 2. Revelado suave de tarjetas y habilidades ---------------- */

    const revealTargets = document.querySelectorAll('.proyecto, .habilidades li, .info_dato, .contacto');

    if (prefersReducedMotion) {
        revealTargets.forEach(el => el.classList.add('is-visible'));
    } else {
        revealTargets.forEach(el => el.classList.add('reveal'));

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        revealTargets.forEach(el => revealObserver.observe(el));
    }

    /* ---------------- 3. Tarjetas de proyecto: inclinación 3D con el mouse ---------------- */

    if (!prefersReducedMotion) {
        const cards = document.querySelectorAll('.proyecto');
        const MAX_TILT = 10; // grados máximos de inclinación

        cards.forEach(card => {
            card.addEventListener('mousemove', (event) => {
                const rect = card.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateY = ((x - centerX) / centerX) * MAX_TILT;
                const rotateX = -((y - centerY) / centerY) * MAX_TILT;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
            });
        });
    }

    /* ---------------- 4. Formulario de contacto ---------------- */

    const WHATSAPP_NUMBER = '18098614877'; // Formato: código de país + número, sin +, espacios ni guiones

    const form = document.querySelector('.formulario');

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const name = form.querySelector('#name');
            const email = form.querySelector('#email');
            const message = form.querySelector('#message');

            if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
                showFormStatus(form, 'Por favor completa todos los campos.', true);
                return;
            }

            const text = `Hola, soy ${name.value.trim()} (${email.value.trim()}).\n\n${message.value.trim()}`;
            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

            showFormStatus(form, 'Abriendo WhatsApp...', false);
            window.open(whatsappUrl, '_blank');
            form.reset();
        });
    }

    function showFormStatus(formEl, text, isError) {
        let status = formEl.querySelector('.form-status');
        if (!status) {
            status = document.createElement('p');
            status.className = 'form-status';
            formEl.appendChild(status);
        }
        status.textContent = text;
        status.classList.toggle('form-status--error', isError);
        status.classList.toggle('form-status--ok', !isError);
    }
});