document.addEventListener('DOMContentLoaded', () => {

    // ── CURSOR GLOW ──────────────────────────────────────────
    const isMobile = window.matchMedia('(max-width: 900px)').matches;

    if (!isMobile) {
        const glow = document.createElement('div');
        glow.className = 'cursor-glow';
        document.body.appendChild(glow);

        let mx = window.innerWidth / 2, my = window.innerHeight / 2;
        let gx = mx, gy = my;

        document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
        document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
        document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });

        (function tick() {
            gx += (mx - gx) * 0.07;
            gy += (my - gy) * 0.07;
            glow.style.left = gx + 'px';
            glow.style.top  = gy + 'px';
            requestAnimationFrame(tick);
        })();
    }


    // ── ORB PARALLAX (mouse + scroll) ────────────────────────
    const orbPink   = document.querySelector('.orb-pink');
    const orbPurple = document.querySelector('.orb-purple');

    if (!isMobile && orbPink && orbPurple) {
        window.addEventListener('mousemove', e => {
            const xf = (e.clientX / window.innerWidth  - 0.5) * 2;
            const yf = (e.clientY / window.innerHeight - 0.5) * 2;
            orbPink.style.transform   = `translate(${xf * -28}px, ${yf * -18}px)`;
            orbPurple.style.transform = `translate(${xf * 18}px,  ${yf * 22}px)`;
        }, { passive: true });

        let lastScrollY = 0;
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            if (Math.abs(y - lastScrollY) > 3) {
                orbPink.style.transform   = `translateY(${y * 0.1}px)`;
                orbPurple.style.transform = `translateY(${y * -0.07}px)`;
                lastScrollY = y;
            }
        }, { passive: true });
    }


    // ── SCROLL REVEAL ────────────────────────────────────────
    const reveals = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -55px 0px' });

    reveals.forEach(el => revealObs.observe(el));

    // Hero above-the-fold elements activate immediately
    setTimeout(() => {
        document.querySelectorAll('.hero .reveal, .hero-content .reveal').forEach(el => {
            el.classList.add('active');
        });
    }, 60);


    // ── NAVBAR GLASS ON SCROLL ───────────────────────────────
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 20);
        }, { passive: true });
    }


    // ── MAGNETIC BUTTONS ─────────────────────────────────────
    if (!isMobile) {
        document.querySelectorAll('.btn-primary').forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const r = btn.getBoundingClientRect();
                const x = (e.clientX - r.left - r.width  / 2) * 0.2;
                const y = (e.clientY - r.top  - r.height / 2) * 0.2;
                btn.style.transform = `translate(${x}px, ${y}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transition = 'transform 0.55s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease';
                btn.style.transform  = '';
                setTimeout(() => { btn.style.transition = ''; }, 560);
            });
        });
    }


    // ── GLASS PANEL 3-D TILT ─────────────────────────────────
    if (!isMobile) {
        const mainPanel = document.querySelector('.glass-panel.panel-main');
        const wrapper   = document.querySelector('.hero-mockup-wrapper');

        if (mainPanel && wrapper) {
            wrapper.addEventListener('mousemove', e => {
                const r = wrapper.getBoundingClientRect();
                const x = (e.clientX - r.left)  / r.width  - 0.5;
                const y = (e.clientY - r.top)    / r.height - 0.5;
                mainPanel.style.transform =
                    `perspective(1100px) rotateY(${x * 7}deg) rotateX(${-y * 5}deg) scale(1.025)`;
            });
            wrapper.addEventListener('mouseleave', () => {
                mainPanel.style.transition = 'transform 0.7s cubic-bezier(0.16,1,0.3,1)';
                mainPanel.style.transform  = '';
                setTimeout(() => { mainPanel.style.transition = ''; }, 720);
            });
        }
    }


    // ── CARD MOUSE SPOTLIGHT ─────────────────────────────────
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', (e.clientX - r.left) + 'px');
            card.style.setProperty('--mouse-y', (e.clientY - r.top)  + 'px');
        });
    });


    // ── FEATURES SIDEBAR SMOOTH SCROLL ───────────────────────
    document.querySelectorAll('.sidebar a').forEach(a => {
        a.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    window.scrollTo({ top: target.offsetTop - 140, behavior: 'smooth' });
                    document.querySelectorAll('.sidebar a').forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });


    // ── COUNTER ANIMATION ────────────────────────────────────
    function runCounter(el) {
        const target = parseFloat(el.dataset.count);
        const isFloat = String(target).includes('.');
        const dur = 1800;
        const t0 = performance.now();
        (function tick(now) {
            const p = Math.min((now - t0) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 4);
            el.textContent = isFloat
                ? (target * ease).toFixed(1)
                : Math.round(target * ease).toLocaleString();
            if (p < 1) requestAnimationFrame(tick);
        })(t0);
    }

    const counterObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting && !e.target.dataset.done) {
                e.target.dataset.done = '1';
                runCounter(e.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

});
