/**
 * VAISHNAVI KEDAR — DESIGN FOLIO
 * Botanical 3D Motion & Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── 1. Smooth Scroll for Internal Anchors ──
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  
  internalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const navHeight = 70;
          const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - navHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
          });

          document.querySelectorAll('.nav-link').forEach(nl => nl.classList.remove('active'));
          if (link.classList.contains('nav-link')) {
            link.classList.add('active');
          }
        }
      }
    });
  });

  // ── 2. Scroll-Reveal Observer for Pages & Dividers ──
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const dividers = document.querySelectorAll('.botanical-divider');
  
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.12
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');

          // If Page 3 is visible, animate progress bars
          if (entry.target.id === 'page3' || entry.target.querySelector('.prof-bar-fill')) {
            const bars = entry.target.querySelectorAll('.prof-bar-fill');
            bars.forEach(bar => {
              const targetWidth = bar.getAttribute('data-progress');
              if (targetWidth) {
                setTimeout(() => {
                  bar.style.width = targetWidth;
                }, 200);
              }
            });
          }

          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // Section Divider Draw-In Observer
    const dividerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-drawn');
          dividerObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.3 });

    dividers.forEach(div => dividerObserver.observe(div));

  } else {
    // Fallback: immediately show all
    revealElements.forEach(el => {
      el.classList.add('is-visible');
      const bars = el.querySelectorAll('.prof-bar-fill');
      bars.forEach(bar => {
        const targetWidth = bar.getAttribute('data-progress');
        if (targetWidth) bar.style.width = targetWidth;
      });
    });
    dividers.forEach(div => div.classList.add('is-drawn'));
  }

  // ── 3. Active Nav Link Tracking on Scroll ──
  const sections = document.querySelectorAll('section[id], div[id^="page"]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNavLink() {
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // ── 4. Hero Avatar 3D Tilt & Layer Parallax ──
  if (!prefersReducedMotion) {
    const hero = document.getElementById('page1');
    const avatarContainer = document.getElementById('hero-avatar-3d');
    const photoFrame = document.getElementById('hero-photo-frame');
    const haloWreath = document.getElementById('hero-halo-wreath');

    if (hero && avatarContainer && photoFrame) {
      hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const rotateX = (y / (rect.height / 2)) * -14;
        const rotateY = (x / (rect.width / 2)) * 14;

        avatarContainer.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        
        if (photoFrame) {
          photoFrame.style.transform = `translateZ(28px) scale(1.02)`;
          photoFrame.style.boxShadow = `${-rotateY * 1.5}px ${rotateX * 1.5 + 12}px 32px rgba(168, 35, 82, 0.28)`;
        }
        if (haloWreath) {
          haloWreath.style.transform = `translate(-50%, -50%) translateZ(10px) rotate(${rotateY * 0.5}deg)`;
        }
      });

      hero.addEventListener('mouseleave', () => {
        avatarContainer.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg)';
        if (photoFrame) {
          photoFrame.style.transform = 'translateZ(0px) scale(1)';
          photoFrame.style.boxShadow = '0 0 0 5px rgba(255, 255, 255, 0.45), 0 10px 30px rgba(168, 35, 82, 0.22)';
        }
        if (haloWreath) {
          haloWreath.style.transform = 'translate(-50%, -50%) translateZ(0px) rotate(0deg)';
        }
      });
    }
  }

  // ── 5. Project Cards 3D "Lift and Tilt Toward Cursor" with Glowing Dynamic Shadow ──
  if (!prefersReducedMotion) {
    const projectCards = document.querySelectorAll('.proj-tile');

    projectCards.forEach(card => {
      // Add specular glare overlay
      let glare = card.querySelector('.card-specular-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'card-specular-glare';
        card.appendChild(glare);
      }

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg tilt
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
        card.style.boxShadow = `${-rotateY * 2.5}px ${rotateX * 2.5 + 16}px 36px rgba(211, 67, 117, 0.22), 0 4px 12px rgba(27, 15, 21, 0.05)`;
        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.boxShadow = '';
      });
    });
  }

  // ── 6. Scoped Hero Sparkle / Petal Trail & Custom Cursor ──
  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    const hero = document.getElementById('page1');
    const heroCursor = document.querySelector('.hero-custom-cursor');

    if (hero) {
      let lastSpawn = 0;
      let particleCount = 0;
      const MAX_PARTICLES = 12;
      const symbols = ['✦', '✧', '🌸', '✨', '⋆'];

      hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;

        if (heroCursor) {
          heroCursor.style.left = `${relX}px`;
          heroCursor.style.top = `${relY}px`;
        }

        const now = Date.now();
        if (now - lastSpawn > 65 && particleCount < MAX_PARTICLES) {
          lastSpawn = now;
          particleCount++;
          spawnHeroSparkle(relX, relY, hero);
        }
      });

      hero.addEventListener('mouseleave', () => {
        if (heroCursor) {
          heroCursor.style.opacity = '0';
        }
        // Clean up any remaining sparkles
        const sparkles = hero.querySelectorAll('.hero-sparkle');
        sparkles.forEach(s => s.remove());
        particleCount = 0;
      });

      function spawnHeroSparkle(x, y, parent) {
        const sparkle = document.createElement('div');
        sparkle.className = 'mystic-sparkle hero-sparkle';
        sparkle.style.position = 'absolute';

        const isSymbol = Math.random() > 0.4;
        if (isSymbol) {
          sparkle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
          sparkle.style.fontSize = `${Math.random() * 11 + 9}px`;
          sparkle.style.color = Math.random() > 0.5 ? '#FF75A2' : '#FFD700';
          sparkle.style.textShadow = '0 0 8px rgba(255,255,255,0.9)';
        } else {
          const size = Math.random() * 4 + 3;
          sparkle.style.width = `${size}px`;
          sparkle.style.height = `${size}px`;
          sparkle.style.background = '#FF85B3';
          sparkle.style.boxShadow = '0 0 10px rgba(255, 117, 162, 0.9)';
        }

        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;

        const tx = (Math.random() - 0.5) * 45;
        const ty = -Math.random() * 45 - 15;
        sparkle.style.setProperty('--tx', `${tx}px`);
        sparkle.style.setProperty('--ty', `${ty}px`);

        parent.appendChild(sparkle);

        setTimeout(() => {
          sparkle.remove();
          particleCount = Math.max(0, particleCount - 1);
        }, 850);
      }
    }
  }

  // ── 7. Tactile 3D Tilt for Stat Pills, Chips & Certs ──
  if (!prefersReducedMotion) {
    const tactileCards = document.querySelectorAll(
      '.hero-stat-card, .p2-tc, .skill-chip, .cert-pill, .contact-card, .p6-stat-card'
    );

    tactileCards.forEach(card => {
      card.classList.add('tilt-3d');
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const rotateX = (y / (rect.height / 2)) * -7;
        const rotateY = (x / (rect.width / 2)) * 7;

        card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }
});
