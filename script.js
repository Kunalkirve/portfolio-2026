/* =========================================================
   KUNAL KIRVE PORTFOLIO — script.js
   Custom cursor · Scroll reveal · Stats counter ·
   Project filter · Tilt cards · Theme toggle · Nav
   ========================================================= */

(function () {
  'use strict';

  /* ─── THEME TOGGLE ───────────────────────────────────── */
  const html        = document.documentElement;
 

  /* ─── CUSTOM CURSOR ──────────────────────────────────── */
  const cursorDot  = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let mx = 0, my = 0;
  let rx = 0, ry = 0;
  let rafId;

  if (cursorDot && cursorRing && window.matchMedia('(pointer:fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursorDot.style.left  = mx + 'px';
      cursorDot.style.top   = my + 'px';
    });

    // Smooth ring follow
    function animateRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
      rafId = requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover state
    const hoverEls = document.querySelectorAll('a, button, [data-tilt], .project-card, .bento-card');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
    });
  }

  /* ─── NAV: scroll shadow + active link ───────────────── */
  const nav     = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Nav shadow
    nav.classList.toggle('scrolled', window.scrollY > 60);

    // Active nav link
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── HAMBURGER / MOBILE MENU ────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger?.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });

  /* ─── SCROLL REVEAL ──────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ─── STATS COUNTER ──────────────────────────────────── */
  const statNums = document.querySelectorAll('.stat-num[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObserver.observe(el));

  function animateCount(el) {
    const target = +el.dataset.count;
    const dur    = 1600;
    const start  = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / dur, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  /* ─── PROJECT FILTER ─────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active state
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Filter cards
      projectCards.forEach(card => {
        const categories = card.dataset.category || '';
        const show = filter === 'all' || categories.includes(filter);

        if (show) {
          card.classList.remove('hidden');
          // Re-trigger reveal
          card.classList.remove('visible');
          setTimeout(() => card.classList.add('visible'), 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ─── 3D TILT EFFECT ─────────────────────────────────── */
  const tiltCards = document.querySelectorAll('[data-tilt]');

  // Only on non-touch devices
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect   = card.getBoundingClientRect();
        const cx     = rect.left + rect.width  / 2;
        const cy     = rect.top  + rect.height / 2;
        const dx     = (e.clientX - cx) / (rect.width  / 2);
        const dy     = (e.clientY - cy) / (rect.height / 2);
        const rotX   =  dy * -6;
        const rotY   =  dx *  6;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
        card.style.transition = 'transform 0.5s ease';
        setTimeout(() => card.style.transition = '', 500);
      });
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease';
      });
    });
  }

  /* ─── HERO PARALLAX ──────────────────────────────────── */
  const heroOrbs = document.querySelectorAll('.orb');
  const heroGrid = document.querySelector('.hero-grid');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled > window.innerHeight) return;
    const pct = scrolled / window.innerHeight;

    heroOrbs.forEach((orb, i) => {
      const speed = (i + 1) * 0.15;
      orb.style.transform = `translateY(${scrolled * speed}px)`;
    });

    if (heroGrid) {
      heroGrid.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
  }, { passive: true });

  /* ─── BUBBLE SYSTEM ─────────────────────────────────────
     Container: #bubble-container (= .hero-avatar-frame)
     • 4 bubbles always alive
     • Hover → pause; Click/Tap → burst → new bubble spawns
     ──────────────────────────────────────────────────── */
  function initBubbles() {
    const container = document.getElementById('bubble-container');
    if (!container) return;

    const MAX_BUBBLES = 4;
    const activeBubbles = [];

    /* ── Responsive bubble size based on container ── */
    function getBubbleSize() {
      const base = container.offsetWidth;
      const min  = base * 0.11;
      const max  = base * 0.33;
      return Math.random() * (max - min) + min;
    }

    /* ── Spawn position ──────────────────────────── */
    function getSpawnPos(size, isInitial) {
      const cw = container.offsetWidth;
      const ch = container.offsetHeight;
      const cx = cw / 2;
      const cy = ch / 2;

      if (isInitial) {
        // Scatter around the frame so they're visible immediately
        const angle  = Math.random() * Math.PI * 2;
        const radius = (Math.random() * 0.6 + 0.4) * (cw / 2);
        return {
          x: cx + Math.cos(angle) * radius - size / 2,
          y: cy + Math.sin(angle) * radius - size / 2
        };
      }
      // New bubble spawns from center of main orb
      return { x: cx - size / 2, y: cy - size / 2 };
    }

    /* ── Bubble class ────────────────────────────── */
    class Bubble {
      constructor(isInitial = false) {
        this.el = document.createElement('div');
        this.el.classList.add('floating-bubble');

        this.size = getBubbleSize();
        this.el.style.width  = `${this.size}px`;
        this.el.style.height = `${this.size}px`;

        const pos = getSpawnPos(this.size, isInitial);
        this.x = pos.x;
        this.y = pos.y;

        // Gentle random velocity
        const speed = 0.4 + Math.random() * 0.7;
        const angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 0.25; // slight upward drift

        this.paused    = false;
        this.bursting  = false;

        this._applyPos();
        container.appendChild(this.el);

        /* Hover: pause float */
        this.el.addEventListener('mouseenter', () => {
          if (this.bursting) return;
          this.paused = true;
          this.el.style.transform = 'scale(1.12)';
        });
        this.el.addEventListener('mouseleave', () => {
          if (this.bursting) return;
          this.paused = false;
          this.el.style.transform = 'scale(1)';
        });

        /* Click + tap: burst */
        const burstHandler = (e) => {
          e.stopPropagation();
          this.burst();
        };
        this.el.addEventListener('click',      burstHandler);
        this.el.addEventListener('touchstart', burstHandler, { passive: true });
      }

      _applyPos() {
        this.el.style.left = `${this.x}px`;
        this.el.style.top  = `${this.y}px`;
      }

      update() {
        if (this.paused || this.bursting) return;

        this.x += this.vx;
        this.y += this.vy;

        const cw = container.offsetWidth;
        const ch = container.offsetHeight;

        // Bouncing boundary: 1.1× frame so bubbles wander outside
        // but stay visually near the orb
        const limitX = cw  * 1.1;
        const limitY = ch  * 1.1;
        const cx = cw / 2;
        const cy = ch / 2;

        if (Math.abs(this.x + this.size / 2 - cx) > limitX) {
          this.vx *= -1;
          this.x  += this.vx * 2;
        }
        if (Math.abs(this.y + this.size / 2 - cy) > limitY) {
          this.vy *= -1;
          this.y  += this.vy * 2;
        }

        this._applyPos();
      }

      burst() {
        if (this.bursting) return;
        this.bursting = true;
        this.paused   = false;

        this.el.classList.add('burst-anim');

        setTimeout(() => {
          this.el.remove();
          const idx = activeBubbles.indexOf(this);
          if (idx > -1) activeBubbles.splice(idx, 1);

          // Spawn replacement after a short delay (feels like it came from the orb)
          setTimeout(() => {
            const b = new Bubble(false);
            activeBubbles.push(b);
          }, 200);
        }, 350);
      }
    }

    /* ── Seed initial bubbles ─────────────────────── */
    for (let i = 0; i < MAX_BUBBLES; i++) {
      // Stagger spawn so they don't all appear at once
      setTimeout(() => {
        activeBubbles.push(new Bubble(true));
      }, i * 180);
    }

    /* ── Animation loop ──────────────────────────── */
    function loop() {
      activeBubbles.forEach(b => b.update());
      requestAnimationFrame(loop);
    }
    loop();
  }

  // Run after DOM + fonts are ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBubbles);
  } else {
    initBubbles(); // already ready
  }

  /* ─── CONTACT FORM ───────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  const submitBtn   = document.getElementById('submitBtn');

  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btnText    = submitBtn.querySelector('.btn-text');
    const btnSending = submitBtn.querySelector('.btn-sending');

    // Validate
    const name  = contactForm.querySelector('[name="name"]').value.trim();
    const email = contactForm.querySelector('[name="email"]').value.trim();
    const msg   = contactForm.querySelector('[name="message"]').value.trim();

    if (!name || !email || !msg) {
      showFormMsg('Please fill in all required fields.', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFormMsg('Please enter a valid email address.', 'error');
      return;
    }

    // Simulate send (replace with actual endpoint / Netlify Forms)
    btnText.style.display    = 'none';
    btnSending.style.display = 'inline';
    submitBtn.disabled = true;

    await new Promise(r => setTimeout(r, 1800));

    btnText.style.display    = 'inline';
    btnSending.style.display = 'none';
    submitBtn.disabled = false;

    showFormMsg('Message sent! I\'ll get back to you within 24 hours. 🎉', 'success');
    contactForm.reset();
  });

  function showFormMsg(text, type) {
    const existing = document.querySelector('.form-msg');
    existing?.remove();

    const el = document.createElement('p');
    el.className = 'form-msg';
    el.textContent = text;
    el.style.cssText = `
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      background: ${type === 'success' ? 'rgba(0,255,148,0.08)' : 'rgba(255,80,80,0.08)'};
      border: 1px solid ${type === 'success' ? 'rgba(0,255,148,0.3)' : 'rgba(255,80,80,0.3)'};
      color: ${type === 'success' ? 'var(--accent-2)' : '#FF5050'};
    `;
    contactForm.appendChild(el);
    setTimeout(() => el.remove(), 6000);
  }

  /* ─── SMOOTH INTERNAL SCROLL ─────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 72; // nav height
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ─── HERO TITLE STAGGER ─────────────────────────────── */
// Initial page load animation (Scoped to Hero ONLY)
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 100 + i * 80);
  });
  document.querySelectorAll('.hero .reveal-right').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 100);
  });
});

  /* ─── MARK HOVERED LINKS for cursor ──────────────────── */
  // Re-run on filter changes
  function rebindCursorHover() {
    if (!cursorRing) return;
    document.querySelectorAll('a, button, [data-tilt], .project-card').forEach(el => {
      el.removeEventListener('mouseenter', cursorEnter);
      el.removeEventListener('mouseleave', cursorLeave);
      el.addEventListener('mouseenter', cursorEnter);
      el.addEventListener('mouseleave', cursorLeave);
    });
  }
  function cursorEnter() { cursorRing?.classList.add('hovering'); }
  function cursorLeave() { cursorRing?.classList.remove('hovering'); }
  rebindCursorHover();

})();
