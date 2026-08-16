document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initMobileMenu();
  initThemeToggle();
  initTypingAnimation();
  initScrollReveal();
  initActiveNavLink();
  initSkillBars();
  initStatCounters();
  initBackToTop();
  initContactForm();
});

/* ---------- 1. Loading animation ---------- */
function initLoader() {
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 400);
  });
}

/* ---------- 2. Sticky navbar background on scroll ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };
  toggle();
  window.addEventListener('scroll', toggle);
}

/* ---------- 3. Mobile hamburger menu ---------- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- 4. Dark / light mode toggle ---------- */
function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  const icon = btn.querySelector('i');
  const saved = localStorageSafeGet('theme');

  if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    icon.className = 'fa-solid fa-sun';
  }

  btn.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      icon.className = 'fa-solid fa-moon';
      localStorageSafeSet('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      icon.className = 'fa-solid fa-sun';
      localStorageSafeSet('theme', 'light');
    }
  });
}

// Guards in case localStorage is unavailable (e.g. some sandboxed environments)
function localStorageSafeGet(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}
function localStorageSafeSet(key, value) {
  try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
}

/* ---------- 5. Typing animation in hero ---------- */
function initTypingAnimation() {
  const el = document.getElementById('typedText');
  const words = ['Software Developer', 'Front-End Developer', 'AI Enthusiast', 'Problem Solver'];
  let wordIndex = 0, charIndex = 0, deleting = false;

  function tick() {
    const current = words[wordIndex];

    if (!deleting) {
      el.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length) {
        deleting = true;
        return setTimeout(tick, 1600);
      }
    } else {
      el.textContent = current.slice(0, --charIndex);
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }
    setTimeout(tick, deleting ? 40 : 90);
  }
  tick();
}

/* ---------- 6. Scroll-reveal animations ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(item => observer.observe(item));
}

/* ---------- 7. Active navbar link on scroll ---------- */
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(section => observer.observe(section));
}

/* ---------- 8. Animate skill progress bars when visible ---------- */
function initSkillBars() {
  const fills = document.querySelectorAll('.fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  fills.forEach(fill => observer.observe(fill));
}

/* ---------- 9. Animated stat counters ---------- */
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(counter => observer.observe(counter));

  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1200;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(frame);
      else el.textContent = target;
    }
    requestAnimationFrame(frame);
  }
}

/* ---------- 10. Back-to-top button ---------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 500);
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- 11. Contact form validation ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  const fields = {
    name: { el: document.getElementById('name'), error: document.getElementById('nameError') },
    email: { el: document.getElementById('email'), error: document.getElementById('emailError') },
    subject: { el: document.getElementById('subject'), error: document.getElementById('subjectError') },
    message: { el: document.getElementById('message'), error: document.getElementById('messageError') },
  };

  const validators = {
    name: v => v.trim().length >= 2 || 'Please enter your name (min 2 characters).',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Please enter a valid email address.',
    subject: v => v.trim().length >= 3 || 'Subject must be at least 3 characters.',
    message: v => v.trim().length >= 10 || 'Message should be at least 10 characters.',
  };

  Object.entries(fields).forEach(([key, field]) => {
    field.el.addEventListener('blur', () => validateField(key));
    field.el.addEventListener('input', () => {
      if (field.el.closest('.form-group').classList.contains('invalid')) validateField(key);
    });
  });

  function validateField(key) {
    const field = fields[key];
    const result = validators[key](field.el.value);
    const group = field.el.closest('.form-group');

    if (result === true) {
      group.classList.remove('invalid');
      field.error.textContent = '';
      return true;
    } else {
      group.classList.add('invalid');
      field.error.textContent = result;
      return false;
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    successMsg.classList.remove('show');

    const allValid = Object.keys(fields).every(validateField);
    if (!allValid) return;


    successMsg.classList.add('show');
    form.reset();
    setTimeout(() => successMsg.classList.remove('show'), 4000);
  });
}
