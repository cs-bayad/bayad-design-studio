/* ============ BAYAD DESIGN STUDIO — script.js ============ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Theme (dark mode) ---------- */
  var savedTheme = null;
  try { savedTheme = localStorage.getItem('bds-theme'); } catch (e) { /* private mode */ }
  if (savedTheme === 'dark') document.body.classList.add('dark');

  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      document.body.classList.toggle('dark');
      try {
        localStorage.setItem('bds-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
      } catch (e) { /* private mode */ }
    });
  }

  /* ---------- Navbar: sticky style on scroll ---------- */
  var navbar = document.getElementById('navbar');
  function onScrollNav() {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- Mobile menu ---------- */
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Ripple effect on buttons ---------- */
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var rect = btn.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height);
      var ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 650);
    });
  });

  /* ---------- Scroll animations (Intersection Observer) ---------- */
  var animated = document.querySelectorAll('[data-animate]');
  if ('IntersectionObserver' in window) {
    var animObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          animObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    animated.forEach(function (el) { animObserver.observe(el); });
  } else {
    animated.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- Animated counters ---------- */
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1600;
    var start = null;
    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var value = Math.round(target * easeOutCubic(progress));
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('.stat-num');
  if ('IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { countObserver.observe(el); });
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------- Portfolio filtering ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var portfolioItems = document.querySelectorAll('.portfolio-item');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      portfolioItems.forEach(function (item) {
        var match = filter === 'all' || item.getAttribute('data-category') === filter;
        item.classList.remove('pop-in');
        if (match) {
          item.classList.remove('hidden');
          void item.offsetWidth; /* restart animation */
          item.classList.add('pop-in');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  /* ---------- FAQ accordion ---------- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      faqItems.forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-a').style.maxHeight = '0px';
      });
      if (!isOpen) {
        item.classList.add('open');
        q.setAttribute('aria-expanded', 'true');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Testimonial slider ---------- */
  var track = document.getElementById('tTrack');
  var dotsWrap = document.getElementById('tDots');
  var prevBtn = document.querySelector('.t-prev');
  var nextBtn = document.querySelector('.t-next');
  if (track && dotsWrap) {
    var slides = track.children.length;
    var current = 0;
    var timer = null;

    for (var i = 0; i < slides; i++) {
      var dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      (function (index) {
        dot.addEventListener('click', function () { goTo(index); restartTimer(); });
      })(i);
      dotsWrap.appendChild(dot);
    }
    var dots = dotsWrap.querySelectorAll('button');

    function goTo(index) {
      current = (index + slides) % slides;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (d, di) { d.classList.toggle('active', di === current); });
    }
    function restartTimer() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () { goTo(current + 1); }, 6000);
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); restartTimer(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); restartTimer(); });
    var slider = document.querySelector('.testimonial-slider');
    if (slider) {
      slider.addEventListener('mouseenter', function () { if (timer) clearInterval(timer); });
      slider.addEventListener('mouseleave', restartTimer);
    }
    goTo(0);
    restartTimer();
  }

  /* ---------- Back to top ---------- */
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    function onScrollTopBtn() {
      backToTop.classList.toggle('visible', window.scrollY > 600);
    }
    window.addEventListener('scroll', onScrollTopBtn, { passive: true });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    onScrollTopBtn();
  }

  /* ---------- Contact form (front-end only for now) ---------- */
  var contactForm = document.getElementById('contactForm');
  var formNote = document.getElementById('formNote');
  if (contactForm && formNote) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = contactForm.querySelector('input[name="name"]').value.trim();
      var email = contactForm.querySelector('input[name="email"]').value.trim();
      var message = contactForm.querySelector('textarea[name="message"]').value.trim();
      if (!name || !email || !message) {
        formNote.textContent = 'Please fill in your name, email, and message.';
        formNote.className = 'form-note err';
        return;
      }
      formNote.textContent = 'Thanks, ' + name + '! (Demo mode — this form is not connected to an inbox yet.)';
      formNote.className = 'form-note ok';
      contactForm.reset();
    });
  }

  /* ---------- Newsletter (front-end only for now) ---------- */
  var newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = newsletterForm.querySelector('input');
      if (input && input.value.trim()) {
        input.value = '';
        input.placeholder = 'Subscribed! (demo mode)';
      }
    });
  }

});

/* ---------- Loader: hide when everything has loaded ---------- */
window.addEventListener('load', function () {
  document.body.classList.remove('preload');
  document.body.classList.add('loaded');
});

/* Safety: never leave the loader stuck if an image hangs */
setTimeout(function () {
  document.body.classList.remove('preload');
  document.body.classList.add('loaded');
}, 4000);