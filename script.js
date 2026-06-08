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
      this.size = Math.random() * 1.5 + 0.5;
      this.speed = Math.random() * 0.8 + 0.3;
      this.angle = Math.random() * Math.PI * 2;
      this.noiseOffset = Math.random() * 1000;

      // Color palette: cyan, purple, emerald — matching the portfolio theme
      const colors = [
        'rgba(0, 168, 255, ',   // brand cyan
        'rgba(168, 85, 247, ',  // purple
        'rgba(16, 185, 129, ',  // emerald
        'rgba(56, 189, 248, '   // sky
      ];
      this.colorBase = colors[Math.floor(Math.random() * colors.length)];
    }

    update(time) {
      // Flow field: particles follow a sine/cosine wave field based on position
      const scale = 0.003;
      const flowAngle =
        Math.sin(this.x * scale + time * 0.0003 + this.noiseOffset) * Math.PI +
        Math.cos(this.y * scale + time * 0.0005) * Math.PI;

      this.angle += (flowAngle - this.angle) * 0.05; // smooth turn

      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;

      // Wrap around edges instead of bouncing
      if (this.x < -10) this.x = canvas.width + 10;
      if (this.x > canvas.width + 10) this.x = -10;
      if (this.y < -10) this.y = canvas.height + 10;
      if (this.y > canvas.height + 10) this.y = -10;

      // Mouse repulsion
      if (mouse.x != null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius && dist > 0) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x += (dx / dist) * force * 4;
          this.y += (dy / dist) * force * 4;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.colorBase + '0.6)';
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
    const maxDist = 100;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.15;
          ctx.strokeStyle = `rgba(100, 150, 200, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      p.update(time);
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
    'Praktikum @ Stadt Mannheim FB12 IT',
    'Auf dem Weg zum IHK-Abschluss 2026',
    'TryHackMe Security Learner',
    'Netzwerke, Cisco & Infrastructure',
    'Junior Sysadmin gesucht'
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
        // Trigger terminal line animation
        const terminalLines = entry.target.querySelectorAll('.terminal-line');
        if (terminalLines.length > 0) {
          terminalLines.forEach((line, i) => {
            setTimeout(() => {
              line.style.transition = 'opacity 0.4s ease';
              line.style.opacity = '1';
            }, i * 120);
          });
        }

        // Trigger signal bars animation
        const signalBars = entry.target.querySelectorAll('.signal-bars');
        signalBars.forEach((bar, barIndex) => {
          const level = parseInt(bar.dataset.level) || 0;
          const divs = bar.querySelectorAll('div');
          setTimeout(() => {
            bar.classList.add('active');
            divs.forEach((div, i) => {
              setTimeout(() => {
                if (i < level) {
                  const classes = Array.from(div.classList);
                  const opacityClass = classes.find(function(c) { return c.includes('/20'); });
                  if (opacityClass) {
                    const fullClass = opacityClass.replace('/20', '');
                    div.classList.remove(opacityClass);
                    div.classList.add(fullClass);
                  }
                }
              }, i * 80);
            });
          }, barIndex * 150);
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
// 4. NAVBAR SCROLL EFFECT + SLIDING PILL
// ============================================
(function initNavbar() {
  const nav = document.getElementById('main-nav');
  const navContainer = document.getElementById('nav-container');
  const links = document.querySelectorAll('.nav-link');
  if (!nav) return;

  // Update nav background on scroll
  function updateNavBg() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  function setActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.getAttribute('id');
      }
    });
    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', () => {
    updateNavBg();
    setActiveLink();
  }, { passive: true });

  updateNavBg();
  setTimeout(setActiveLink, 200);
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

      const offset = 100;
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
