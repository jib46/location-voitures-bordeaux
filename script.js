/* =============================================
   NAVIGATION — sticky + hamburger
   ============================================= */
const header    = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

// Sticky header on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}, { passive: true });

// Hamburger toggle
hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu on link click (mobile)
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
    if (!header.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
});

/* =============================================
   SMOOTH SCROLL
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

/* =============================================
   REVEAL ON SCROLL
   ============================================= */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Stagger cards in a grid
            const siblings = entry.target.parentElement.querySelectorAll('.reveal');
            const idx = Array.from(siblings).indexOf(entry.target);
            const delay = (idx % 3) * 80;

            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);

            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* =============================================
   ACTIVE NAV LINK on scroll
   ============================================= */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navAnchors.forEach(a => {
                const isActive = a.getAttribute('href') === `#${id}`;
                a.style.color = isActive ? 'var(--gold)' : '';
            });
        }
    });
}, {
    threshold: 0.4,
});

sections.forEach(s => sectionObserver.observe(s));

/* =============================================
   PLATFORM BUTTON — click feedback
   ============================================= */
document.querySelectorAll('.btn-platform, .contact-platform-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        if (this.getAttribute('href') === '#') {
            e.preventDefault();

            // Ripple effect
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position:absolute; border-radius:50%;
                background:rgba(255,255,255,0.15);
                width:4px; height:4px;
                pointer-events:none;
                animation: rippleAnim 0.5s ease forwards;
                left: ${e.offsetX}px; top: ${e.offsetY}px;
            `;
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 500);

            // Toast notification
            showToast('Lien de réservation bientôt disponible !');
        }
    });
});

function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${message}`;
    toast.style.cssText = `
        position: fixed;
        bottom: 32px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: #1c1c1c;
        border: 1px solid rgba(201,168,76,0.35);
        color: #e8c96a;
        padding: 14px 24px;
        border-radius: 10px;
        font-size: 0.875rem;
        font-weight: 500;
        font-family: 'Inter', sans-serif;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
        white-space: nowrap;
        pointer-events: none;
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/* Ripple keyframe */
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleAnim {
        from { transform: scale(1); opacity: 0.6; width: 4px; height: 4px; margin: -2px; }
        to   { transform: scale(40); opacity: 0; }
    }
`;
document.head.appendChild(style);

/* =============================================
   HERO PARALLAX (subtle)
   ============================================= */
const heroBg = document.querySelector('.hero-bg-grid');
if (heroBg) {
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
            heroBg.style.transform = `translateY(${y * 0.2}px)`;
        }
    }, { passive: true });
}
