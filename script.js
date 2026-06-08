/**
 * Portfolio Redesign — Interactive Scripts
 * Canvas Particles, Typewriter, Scroll Reveal, Skill Bars
 */

// ============================================
// 1. CANVAS PARTICLE BACKGROUND
// ============================================
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  let mouse = { x: null, y: null, radius: 150 };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2 + 0.5;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = Math.random() * 30 + 1;
    }

    update() {
      // Mouse interaction
      if (mouse.x != null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const maxDistance = mouse.radius;
        const force = (maxDistance - distance) / maxDistance;
        const directionX = forceDirectionX * force * this.density * 0.6;
        const directionY = forceDirectionY * force * this.density * 0.6;

        if (distance < mouse.radius) {
          this.x -= directionX;
          this.y -= directionY;
        } else {
          if (this.x !== this.baseX) {
            const dx = this.x - this.baseX;
            this.x -= dx / 20;
          }
          if (this.y !== this.baseY) {
            const dy = this.y - this.baseY;
            this.y -= dy / 20;
          }
        }
      }

      // Normal movement
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off edges
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 168, 255, 0.5)';
      ctx.fill();
    }
  }

  function init() {
    particles = [];
    const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 100);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function connect() {
    const maxDist = 120;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const opacity = 1 - dist / maxDist;
          ctx.strokeStyle = `rgba(0, 168, 255, ${opacity * 0.2})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      p.update();
      p.draw();
    }
    connect();
    animationId = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    resize();
    init();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  resize();
  init();
  animate();
})();

// ============================================
// 2. TYPEWRITER EFFECT
// ============================================
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'Fachinformatiker für Systemintegration',
    'Cybersecurity Enthusiast',
    'IoT & Hardware Tinkerer',
    'Netzwerktechnik Nerd',
    'TryHackMe Learner'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 60;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 30;
    } else {
      el.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 60;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2500; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400; // Pause before new phrase
    }

    setTimeout(type, typingSpeed);
  }

  // Start after a short delay
  setTimeout(type, 1200);
})();

// ============================================
// 3. SCROLL REVEAL (Intersection Observer)
// ============================================
(function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Trigger skill bar animation if inside
        const bars = entry.target.querySelectorAll('.skill-bar');
        bars.forEach(bar => {
          const width = bar.closest('.skill-item')?.dataset.width;
          if (width) {
            setTimeout(() => {
              bar.style.width = width + '%';
            }, 300);
          }
        });
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal-section').forEach(el => observer.observe(el));
})();

// ============================================
// 4. NAVBAR SCROLL EFFECT
// ============================================
(function initNavbar() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  function update() {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// ============================================
// 5. SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      // Close mobile menu if open
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
      }

      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    });
  });
})();

// ============================================
// 6. MOBILE MENU TOGGLE
// ============================================
(function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
    });
  });
})();

// ============================================
// 7. PARALLAX EFFECT ON HERO
// ============================================
(function initParallax() {
  const header = document.querySelector('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      header.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  }, { passive: true });
})();

// ============================================
// 8. CAREER PATH ANIMATION
// ============================================
(function initCareerPath() {
  const pathContainer = document.getElementById('career-path');
  if (!pathContainer) return;

  const pathLine = document.getElementById('path-line');
  const pathLineMobile = document.getElementById('path-line-mobile');
  const stations = document.querySelectorAll('.path-station');

  let pathAnimated = false;

  function activateStation(index, delay) {
    setTimeout(() => {
      const station = stations[index];
      if (!station) return;

      const dot = station.querySelector('.station-dot');
      const card = station.querySelector('.station-card');

      if (dot) dot.classList.add('active');
      if (card) card.classList.add('active');
    }, delay);
  }

  function drawPath() {
    if (pathAnimated) return;
    pathAnimated = true;

    // Draw the SVG path
    if (pathLine) pathLine.classList.add('drawn');
    if (pathLineMobile) pathLineMobile.classList.add('drawn');

    // Activate stations sequentially
    activateStation(0, 400);
    activateStation(1, 1200);
    activateStation(2, 2000);
  }

  // Use IntersectionObserver to trigger when section is visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        drawPath();
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  });

  observer.observe(pathContainer);

  // Also allow clicking on dots to reveal cards
  stations.forEach(station => {
    const dot = station.querySelector('.station-dot');
    const card = station.querySelector('.station-card');

    if (dot && card) {
      dot.addEventListener('click', () => {
        dot.classList.add('active');
        card.classList.add('active');
      });
    }
  });
})();
