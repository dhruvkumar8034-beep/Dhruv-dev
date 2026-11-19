/**
 * Dhruv Kumar — High Performance Interactive Enhancements
 * Features:
 * - Hardware-accelerated 3D card tilt with rAF throttling
 * - Smooth metric counters with IntersectionObserver
 * - Interactive Terminal with tab switching
 * - Fast, one-click email copy with toast notification
 * - 100% optimized for 120 FPS performance (zero body style thrashing)
 */

(function () {
  'use strict';

  // 1. Lightweight Hardware-Accelerated Card Tilt (rAF Throttled)
  function init3DCardTilt() {
    const cards = document.querySelectorAll('.project');
    if (!cards.length) return;

    cards.forEach(card => {
      let isTicking = false;
      let targetX = 0;
      let targetY = 0;

      function updateCard() {
        const rect = card.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((targetY - centerY) / centerY) * -4;
        const rotateY = ((targetX - centerX) / centerX) * 4;

        card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(1)}deg) rotateY(${rotateY.toFixed(1)}deg) translateY(-4px)`;
        isTicking = false;
      }

      card.addEventListener('pointermove', e => {
        const rect = card.getBoundingClientRect();
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;

        if (!isTicking) {
          isTicking = true;
          requestAnimationFrame(updateCard);
        }
      }, { passive: true });

      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
        isTicking = false;
      });
    });
  }

  // 2. Metric Counter Up-Count Animation (IntersectionObserver)
  function initCounters() {
    const counters = document.querySelectorAll('[data-counter-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          observer.unobserve(el);
          const target = parseFloat(el.dataset.counterTarget);
          const prefix = el.dataset.counterPrefix || '';
          const suffix = el.dataset.counterSuffix || '';
          const decimals = parseInt(el.dataset.counterDecimals || '0', 10);
          const duration = 1200; // ms
          const start = performance.now();

          function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = target * ease;
            el.textContent = `${prefix}${current.toFixed(decimals)}${suffix}`;
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
            }
          }
          requestAnimationFrame(step);
        }
      });
    }, { threshold: 0.2 });

    counters.forEach(c => observer.observe(c));
  }

  // 3. Interactive Terminal Tabs (Dhruv Kumar Skills & Content)
  function initTerminal() {
    const terminal = document.querySelector('.terminal-card');
    if (!terminal) return;

    const tabButtons = terminal.querySelectorAll('.terminal-tab');
    const contentPanes = terminal.querySelectorAll('.terminal-pane');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.tab;
        tabButtons.forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        contentPanes.forEach(p => p.classList.remove('is-active'));

        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        const targetPane = terminal.querySelector(`#tab-${targetId}`);
        if (targetPane) targetPane.classList.add('is-active');
      });
    });
  }

  // 4. One-Click Email Copy with Glass Toast
  function initEmailCopy() {
    let toast = document.getElementById('copy-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'copy-toast';
      toast.className = 'copy-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }

    let toastTimer = null;
    function showToast(msg) {
      toast.textContent = msg;
      toast.classList.add('is-visible');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove('is-visible');
      }, 2500);
    }

    document.querySelectorAll('.contact-email, a[href^="mailto:"]').forEach(link => {
      link.addEventListener('click', () => {
        const email = 'dhruvkumar.dev@gmail.com';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(email).then(() => {
            showToast('Email copied to clipboard! 📋✨');
          }).catch(() => {});
        }
      });
    });
  }

  function init() {
    init3DCardTilt();
    initCounters();
    initTerminal();
    initEmailCopy();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
