document.addEventListener('DOMContentLoaded', () => {
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
    reveals.forEach(reveal => revealObserver.observe(reveal));
    setTimeout(() => {
        document.querySelectorAll('.hero .reveal, .navbar.reveal').forEach(el => el.classList.add('active'));
    }, 100);
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
                navbar.style.background = 'rgba(11, 15, 20, 0.95)';
            } else {
                navbar.classList.remove('scrolled');
                navbar.style.background = 'rgba(11, 15, 20, 0.8)';
            }
        });
    }
    document.querySelectorAll('.sidebar a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if(targetId.startsWith('#')) {
                e.preventDefault();
                const targetEl = document.querySelector(targetId);
                if(targetEl) {
                    window.scrollTo({ top: targetEl.offsetTop - 140, behavior: 'smooth' });
                    document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });
});
