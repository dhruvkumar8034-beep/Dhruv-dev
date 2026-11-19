/**
 * Dhruv Kumar — Ultra-Smooth Profile Photo Particle Dispersion Engine
 * Optimized for 60-120 FPS performance with zero idle CPU overhead.
 */

(function () {
  'use strict';

  function initProfileParticles() {
    const card = document.getElementById('profile-particle-card');
    const wrapper = document.getElementById('profile-wrapper');
    const img = document.getElementById('profile-img');
    const canvas = document.getElementById('profile-canvas');
    const hint = card ? card.querySelector('.profile-interactive-hint span') : null;

    if (!card || !wrapper || !img || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let particles = [];
    let isHovered = false;
    let isTouchActive = false;
    let isLoopRunning = false;
    let mouseX = -9999;
    let mouseY = -9999;
    let animId = null;
    let settleFrames = 0;
    let sampleImgReady = false;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const sampler = document.createElement('canvas');
    const sCtx = sampler.getContext('2d', { willReadFrequently: true });
    const sampleImg = new Image();
    sampleImg.crossOrigin = 'anonymous';

    function buildParticles(pixels) {
      particles = [];
      const step = 4; // High-density grid with excellent 120fps performance
      const pSize = 2.4;

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const index = (y * width + x) * 4;
          const a = pixels[index + 3];

          if (a > 30) {
            const r = pixels[index];
            const g = pixels[index + 1];
            const b = pixels[index + 2];

            particles.push({
              ox: x,
              oy: y,
              x: x,
              y: y,
              vx: 0,
              vy: 0,
              size: pSize,
              color: `rgb(${r},${g},${b})`,
              spring: 0.08,
              friction: 0.82
            });
          }
        }
      }
    }

    function samplePhoto() {
      if (!sampleImgReady || !width || !height) return;

      try {
        sampler.width = width;
        sampler.height = height;
        sCtx.clearRect(0, 0, width, height);

        const nw = sampleImg.naturalWidth || 902;
        const nh = sampleImg.naturalHeight || 1599;

        // Crop centered on smiling face & shoulders (18% from top)
        const scale = Math.max(width / nw, height / nh);
        const sw = width / scale;
        const sh = height / scale;
        const sx = Math.max(0, (nw - sw) * 0.5);
        const sy = Math.max(0, (nh - sh) * 0.18);

        sCtx.drawImage(sampleImg, sx, sy, sw, sh, 0, 0, width, height);
        const imgData = sCtx.getImageData(0, 0, width, height);
        buildParticles(imgData.data);
      } catch (e) {
        console.warn('Particle sampler fallback:', e);
      }
    }

    function resize() {
      const rect = wrapper.getBoundingClientRect();
      const nw = Math.round(rect.width);
      const nh = Math.round(rect.height);

      if (nw === 0 || nh === 0) return;
      if (nw === width && nh === height) return;

      width = nw;
      height = nh;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (sampleImgReady) {
        samplePhoto();
      }
    }

    function renderDots() {
      ctx.clearRect(0, 0, width, height);
      const len = particles.length;

      // Hardware-accelerated fast rect drawing (10x faster than trigonometric arc)
      for (let i = 0; i < len; i++) {
        const p = particles[i];
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - 1.2, p.y - 1.2, p.size, p.size);
      }
    }

    function loop() {
      let maxDistFromOrigin = 0;
      const len = particles.length;
      const repelDist = 72;
      const repelDistSq = repelDist * repelDist;

      for (let i = 0; i < len; i++) {
        const p = particles[i];

        // 1. Spring return physics
        const dxOrigin = p.ox - p.x;
        const dyOrigin = p.oy - p.y;
        p.vx += dxOrigin * p.spring;
        p.vy += dyOrigin * p.spring;

        // 2. Cursor repulsion
        if (isHovered || isTouchActive) {
          const dxMouse = p.x - mouseX;
          const dyMouse = p.y - mouseY;
          const distSq = dxMouse * dxMouse + dyMouse * dyMouse;

          if (distSq < repelDistSq && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / repelDist) * 9;
            p.vx += (dxMouse / dist) * force;
            p.vy += (dyMouse / dist) * force;
          }
        }

        p.vx *= p.friction;
        p.vy *= p.friction;
        p.x += p.vx;
        p.y += p.vy;

        const d = Math.abs(dxOrigin) + Math.abs(dyOrigin);
        if (d > maxDistFromOrigin) maxDistFromOrigin = d;
      }

      renderDots();

      // If mouse left, settle within 25 frames and sleep
      if (!isHovered && !isTouchActive) {
        settleFrames++;
        if (settleFrames > 25 || maxDistFromOrigin < 0.6) {
          // Snap back to exact origin & stop
          for (let i = 0; i < len; i++) {
            particles[i].x = particles[i].ox;
            particles[i].y = particles[i].oy;
            particles[i].vx = 0;
            particles[i].vy = 0;
          }
          renderDots();

          img.classList.remove('is-hidden');
          canvas.classList.remove('is-active');
          card.classList.remove('is-dispersing');
          if (hint) hint.textContent = 'Hover photo to scatter dots ✨';

          isLoopRunning = false;
          cancelAnimationFrame(animId);
          return;
        }
      }

      animId = requestAnimationFrame(loop);
    }

    function activateDispersion() {
      settleFrames = 0;
      isHovered = true;
      card.classList.add('is-dispersing');
      img.classList.add('is-hidden');
      canvas.classList.add('is-active');
      if (hint) hint.textContent = 'Move cursor to scatter dots ✦';

      if (!isLoopRunning) {
        isLoopRunning = true;
        animId = requestAnimationFrame(loop);
      }
    }

    function deactivateDispersion() {
      isHovered = false;
      isTouchActive = false;
      mouseX = -9999;
      mouseY = -9999;
    }

    function triggerBlast(clickX, clickY) {
      const len = particles.length;
      const blastRadius = 90;
      const blastRadiusSq = blastRadius * blastRadius;

      for (let i = 0; i < len; i++) {
        const p = particles[i];
        const dx = p.x - clickX;
        const dy = p.y - clickY;
        const distSq = dx * dx + dy * dy;

        if (distSq < blastRadiusSq) {
          const dist = Math.sqrt(distSq) || 0.1;
          const force = (1 - dist / blastRadius) * 20;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }
    }

    // Pointer event bindings
    wrapper.addEventListener('pointerenter', (e) => {
      const rect = wrapper.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      activateDispersion();
    });

    wrapper.addEventListener('pointermove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      if (!isHovered) activateDispersion();
    }, { passive: true });

    wrapper.addEventListener('pointerleave', deactivateDispersion);

    wrapper.addEventListener('pointerdown', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      triggerBlast(x, y);
      if (!isLoopRunning) {
        isLoopRunning = true;
        animId = requestAnimationFrame(loop);
      }
    });

    // Touch Support for Mobile
    wrapper.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        const rect = wrapper.getBoundingClientRect();
        mouseX = e.touches[0].clientX - rect.left;
        mouseY = e.touches[0].clientY - rect.top;
        isTouchActive = true;
        activateDispersion();
        triggerBlast(mouseX, mouseY);
      }
    }, { passive: true });

    wrapper.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        const rect = wrapper.getBoundingClientRect();
        mouseX = e.touches[0].clientX - rect.left;
        mouseY = e.touches[0].clientY - rect.top;
      }
    }, { passive: true });

    wrapper.addEventListener('touchend', () => {
      setTimeout(deactivateDispersion, 300);
    });

    sampleImg.onload = () => {
      sampleImgReady = true;
      resize();
    };

    if (window.DHRUV_PROFILE_DATA_URI) {
      sampleImg.src = window.DHRUV_PROFILE_DATA_URI;
    } else {
      sampleImg.src = 'assets/profile.jpg';
    }

    window.addEventListener('resize', resize, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProfileParticles);
  } else {
    initProfileParticles();
  }
})();
