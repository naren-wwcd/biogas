/* ============================================================
   PHENIX BIOGAS — Ultra-Interactive JavaScript v3
   Particles · Magnetic Btns · Tilt · Typing · Morphing Numbers
   ============================================================ */

/* ── Particle Canvas ────────────────────────────────────────── */
(function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particleCanvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:.5;';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const COLORS = ['#39ff14', '#b5e853', '#00e676', '#1de9b6', '#d4ff3b'];

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x  = Math.random() * W;
            this.y  = Math.random() * H;
            this.r  = Math.random() * 2 + 0.5;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.alpha = Math.random() * 0.5 + 0.1;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.pulse = Math.random() * Math.PI * 2;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.pulse += 0.02;
            if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
        }
        draw() {
            const a = this.alpha * (0.7 + 0.3 * Math.sin(this.pulse));
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = a;
            ctx.fill();
        }
    }

    // Spawn particles
    for (let i = 0; i < 90; i++) particles.push(new Particle());

    // Connect nearby particles
    function drawConnections() {
        const MAX_DIST = 120;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d  = Math.sqrt(dx * dx + dy * dy);
                if (d < MAX_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = '#39ff14';
                    ctx.globalAlpha = (1 - d / MAX_DIST) * 0.12;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function loop() {
        ctx.clearRect(0, 0, W, H);
        drawConnections();
        particles.forEach(p => { p.update(); p.draw(); });
        ctx.globalAlpha = 1;
        requestAnimationFrame(loop);
    }
    loop();
})();

/* ── Custom Cursor ──────────────────────────────────────────── */
(function initCursor() {
    const dot  = document.createElement('div');  dot.className  = 'cursor-dot';
    const ring = document.createElement('div'); ring.className = 'cursor-ring';
    document.body.append(dot, ring);

    let mx = -100, my = -100;
    let rx = -100, ry = -100;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    document.addEventListener('mousedown', () => ring.classList.add('clicking'));
    document.addEventListener('mouseup',   () => ring.classList.remove('clicking'));

    // Smooth ring following with lerp
    function moveCursor() {
        dot.style.left = mx + 'px'; dot.style.top = my + 'px';
        rx += (mx - rx) * 0.14;
        ry += (my - ry) * 0.14;
        ring.style.left = rx + 'px'; ring.style.top  = ry + 'px';
        requestAnimationFrame(moveCursor);
    }
    moveCursor();

    // Hover detection
    document.querySelectorAll('a,button,.product-card,.benefit-card,.impact-item,.process-step,.calc-result-card,.info-box').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
})();

/* ── Typing Headline Effect ─────────────────────────────────── */
(function initTyping() {
    const target = document.querySelector('.type-target');
    if (!target) return;
    const phrases = [
        'Clean Energy Out.',
        'Bio-CNG Out.',
        'Zero Waste Out.',
        'Carbon Credits Out.',
        'Organic Fertilizer Out.'
    ];
    let pi = 0, ci = 0, deleting = false;

    function tick() {
        const phrase = phrases[pi];
        if (!deleting) {
            target.textContent = phrase.slice(0, ci + 1);
            ci++;
            if (ci === phrase.length) { deleting = true; setTimeout(tick, 1600); return; }
        } else {
            target.textContent = phrase.slice(0, ci - 1);
            ci--;
            if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
        }
        setTimeout(tick, deleting ? 48 : 72);
    }
    tick();
})();

/* ── Scroll-activated nav ───────────────────────────────────── */
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (nav) nav.classList.toggle('scrolled', window.pageYOffset > 60);

    // Scroll-spy
    let current = '';
    document.querySelectorAll('section[id]').forEach(section => {
        if (window.pageYOffset >= section.offsetTop - 220) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (current && link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}, { passive: true });

/* ── Mobile Nav ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    /* ── Reveal on Scroll ─────────────────────────────────── */
    const ro = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => ro.observe(el));

    /* ── Counter Animations ───────────────────────────────── */
    const co = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                countUp(e.target);
                co.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count],[data-target]').forEach(el => co.observe(el));

    /* ── Process step highlight ───────────────────────────── */
    const po = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            e.target.classList.toggle('active-step', e.isIntersecting);
        });
    }, { threshold: 0.6 });

    document.querySelectorAll('.process-step').forEach(el => po.observe(el));

    /* ── Magnetic buttons ─────────────────────────────────── */
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const cx = rect.left + rect.width  / 2;
            const cy = rect.top  + rect.height / 2;
            const dx = (e.clientX - cx) * 0.35;
            const dy = (e.clientY - cy) * 0.35;
            btn.style.transform = `translate(${dx}px,${dy}px) translateY(-3px) scale(1.04)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    /* ── Tilt on product cards ────────────────────────────── */
    document.querySelectorAll('.product-card,.benefit-card,.impact-item,.stat-box').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 14;
            const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -14;
            card.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) scale(1.03)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)';
            setTimeout(() => card.style.transition = '', 550);
        });
    });

    /* ── Ripple click effect ──────────────────────────────── */
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const ripple = document.createElement('span');
            const rect   = btn.getBoundingClientRect();
            const size   = Math.max(rect.width, rect.height);
            ripple.style.cssText = `
                position:absolute;
                left:${e.clientX - rect.left - size/2}px;
                top:${e.clientY - rect.top  - size/2}px;
                width:${size}px; height:${size}px;
                border-radius:50%;
                background:rgba(255,255,255,0.25);
                transform:scale(0); animation:rippleAnim 0.55s ease;
                pointer-events:none; z-index:10;
            `;
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 560);
        });
    });

    /* Ripple keyframe */
    if (!document.getElementById('rippleStyle')) {
        const s = document.createElement('style');
        s.id = 'rippleStyle';
        s.textContent = `
            @keyframes rippleAnim {
                to { transform:scale(3); opacity:0; }
            }
            .btn { position:relative; overflow:hidden; }
        `;
        document.head.appendChild(s);
    }

    /* ── Orbit diagram nodes ──────────────────────────────── */
    buildOrbitDiagram();

    /* ── Calculator ───────────────────────────────────────── */
    initCalculator();

    /* ── Contact form ─────────────────────────────────────── */
    const form = document.getElementById('contactForm');
    if (form) form.addEventListener('submit', e => { e.preventDefault(); handleFormSubmit(form); });

    /* ── Smooth scroll ────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
        });
    });

    /* ── Parallax bubbles on scroll ──────────────────────── */
    window.addEventListener('scroll', () => {
        const sy = window.pageYOffset;
        document.querySelectorAll('.bubble').forEach((b, i) => {
            b.style.transform = `translateY(-${sy * (0.04 + i * 0.008)}px)`;
        });
    }, { passive: true });

    /* ── Number ticker on hero ────────────────────────────── */
    document.querySelectorAll('.hero-metric-value[data-count]').forEach(el => {
        const io = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                animateNum(el, 0, +el.dataset.count, 1800, el.dataset.suffix || '+');
                io.disconnect();
            }
        }, { threshold: 0.5 });
        io.observe(el);
    });

    console.log('%c🌿 Phenix Biogas — Initialized', 'color:#39ff14;font-weight:bold;font-size:14px;');
});

/* ── Count-Up ───────────────────────────────────────────────── */
function countUp(el) {
    const target  = +(el.dataset.target || el.dataset.count || 0);
    const suffix  = el.dataset.suffix || (el.dataset.target ? '+' : '+');
    const prefix  = el.dataset.prefix || '';
    animateNum(el, 0, target, 2000, suffix, prefix);
}

function animateNum(el, from, to, dur, suffix = '', prefix = '') {
    const start = performance.now();
    function frame(now) {
        const p = Math.min((now - start) / dur, 1);
        const e = 1 - Math.pow(1 - p, 4); // easeOutQuart
        const v = Math.round(from + (to - from) * e);
        el.textContent = prefix + v.toLocaleString('en-IN') + suffix;
        if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

/* ── Orbit Diagram ──────────────────────────────────────────── */
function buildOrbitDiagram() {
    const diagram = document.querySelector('.about-diagram');
    if (!diagram) return;

    const nodes = [
        { emoji: '🗑️', label: 'Waste',   radius: '90px',  start: '0deg',    dur: '10s' },
        { emoji: '🔬', label: 'Digest',  radius: '90px',  start: '180deg',  dur: '10s' },
        { emoji: '⚡', label: 'Energy',  radius: '125px', start: '60deg',   dur: '18s' },
        { emoji: '🌱', label: 'Fertil.', radius: '125px', start: '240deg',  dur: '18s' },
        { emoji: '💰', label: 'Revenue', radius: '155px', start: '120deg',  dur: '26s' },
        { emoji: '🌍', label: 'Carbon',  radius: '155px', start: '300deg',  dur: '26s' },
    ];

    nodes.forEach(n => {
        const node = document.createElement('div');
        node.className = 'orbit-node';
        node.title = n.label;
        node.textContent = n.emoji;
        node.style.cssText = `--start:${n.start};--radius:${n.radius};animation-duration:${n.dur};`;
        diagram.appendChild(node);
    });
}

/* ── Biogas Calculator ──────────────────────────────────────── */
function initCalculator() {
    const ws = document.getElementById('wasteSlider');
    const ms = document.getElementById('moistureSlider');
    const ts = document.getElementById('typeSlider');
    if (!ws) return;

    const typeFactors = [0.45, 0.55, 0.50, 0.35];
    const typeLabels  = ['Agri Waste', 'Food Waste', 'Mixed Waste', 'Sludge'];

    function updateSliderFill(slider) {
        const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
        slider.style.background = `linear-gradient(to right,var(--g-primary) ${pct}%,var(--bg-surface) ${pct}%)`;
    }

    function calculate() {
        const waste    = +ws.value;
        const moisture = +ms.value / 100;
        const typeIdx  = +ts.value - 1;
        const factor   = typeFactors[typeIdx];

        document.getElementById('wasteVal').textContent    = waste.toLocaleString('en-IN') + ' kg/day';
        document.getElementById('moistureVal').textContent = ms.value + '%';
        document.getElementById('typeVal').textContent     = typeLabels[typeIdx];

        const vs      = waste * (1 - moisture) * 0.85;
        const biogas  = vs * factor;
        const elec    = biogas * 1.8;
        const co2     = biogas * 1.15;
        const savings = (elec * 365 * 8) / 100000;

        setResult('biogasOut',  Math.round(biogas), '');
        setResult('elecOut',    Math.round(elec),   '');
        setResult('co2Out',     Math.round(co2),    '');
        setResult('savingsOut', '₹' + savings.toFixed(1), '');

        // Flash result cards
        document.querySelectorAll('.calc-result-card').forEach(card => {
            card.classList.add('updated');
            setTimeout(() => card.classList.remove('updated'), 600);
        });
    }

    function setResult(id, val, unit) {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.transform = 'scale(1.18)';
        el.style.color = '#d4ff3b';
        setTimeout(() => {
            el.textContent  = val;
            el.style.transform = 'scale(1)';
            el.style.color = '';
        }, 120);
    }

    [ws, ms, ts].forEach(slider => {
        slider.addEventListener('input', () => {
            updateSliderFill(slider);
            calculate();
        });
        updateSliderFill(slider);
    });

    calculate();
}

/* ── Product Modals ─────────────────────────────────────────── */
function openModal(key) {
    const el = document.getElementById('modal-' + key);
    if (!el) return;
    el.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', escHandler);
}

function closeModal(key) {
    const el = document.getElementById('modal-' + key);
    if (!el) return;
    el.classList.remove('active');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', escHandler);
}

function escHandler(e) {
    if (e.key === 'Escape') {
        ['biogas','owc','biocng','waste'].forEach(k => {
            const o = document.getElementById('modal-' + k);
            if (o && o.classList.contains('active')) closeModal(k);
        });
    }
}

/* ── Contact Form ───────────────────────────────────────────── */
function handleFormSubmit(form) {
    const name    = document.getElementById('fname')?.value.trim();
    const email   = document.getElementById('femail')?.value.trim();
    const phone   = document.getElementById('fphone')?.value.trim();
    const service = document.getElementById('fservice')?.value;
    const message = document.getElementById('fmessage')?.value.trim();

    if (!name || !email || !phone || !service || !message) {
        showToast('⚠️ Please fill in all required fields.', 'error'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('⚠️ Please enter a valid email address.', 'error'); return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled  = true;

    setTimeout(() => {
        showToast('🌿 Message sent! We\'ll respond within 24 hours.', 'success');
        form.reset();
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        btn.disabled  = false;

        // Reset slider fills
        ['wasteSlider','moistureSlider','typeSlider'].forEach(id => {
            const s = document.getElementById(id);
            if (s) {
                const pct = ((s.value - s.min) / (s.max - s.min)) * 100;
                s.style.background = `linear-gradient(to right,var(--g-primary) ${pct}%,var(--bg-surface) ${pct}%)`;
            }
        });
    }, 1600);
}

/* ── Toast ──────────────────────────────────────────────────── */
function showToast(msg, type) {
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i><span>${msg}</span>`;
    document.body.appendChild(t);
    setTimeout(() => {
        t.style.animation = 'toastOut 0.4s ease forwards';
        setTimeout(() => t.remove(), 420);
    }, 4200);
}

/* ── Glitch text on logo hover ──────────────────────────────── */
(function initGlitch() {
    const logo = document.querySelector('.logo h1');
    if (!logo) return;
    const orig = logo.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$';

    logo.addEventListener('mouseenter', () => {
        let i = 0;
        const iv = setInterval(() => {
            logo.textContent = orig.split('').map((c, idx) =>
                idx <= i ? c : chars[Math.floor(Math.random() * chars.length)]
            ).join('');
            i++;
            if (i >= orig.length) { logo.textContent = orig; clearInterval(iv); }
        }, 40);
    });
})();

/* ── Smooth scroll ──────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const t = document.querySelector(a.getAttribute('href'));
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
});