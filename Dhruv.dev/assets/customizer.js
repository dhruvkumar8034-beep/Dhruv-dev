/**
 * Dhruv.dev Portfolio Customizer Web App Module
 * Enables real-time in-browser customization, live particle physics updates,
 * and localStorage persistence for Dhruv.
 */

(function () {
  const STORAGE_KEY = 'dhruv_portfolio_data_v1';

  const defaultData = {
    wordmark: 'Dhruv.dev',
    heroName: 'Dhruv.dev',
    tagline: 'Full-stack, AI, and systems engineering.',
    intro: 'I’m Dhruv, a full-stack engineer, AI developer, and systems architect.',
    email: 'dhruv@dhruv.dev',
    github: 'https://github.com/dhruv-dev',
    linkedin: 'https://linkedin.com/in/dhruv-dev'
  };

  function loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
    } catch (e) {
      return defaultData;
    }
  }

  function saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  function applyData(data) {
    // 1. Wordmarks
    const wordmarkEl = document.querySelector('.wordmark');
    if (wordmarkEl) {
      wordmarkEl.innerHTML = `${escapeHtml(data.wordmark)}<span class="wordmark-period" aria-hidden="true">.</span>`;
    }

    // 2. Hero Fallback & Particle Source
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle && heroTitle.textContent !== data.heroName) {
      heroTitle.textContent = data.heroName;
      // Trigger canvas resize & particle recreation
      window.dispatchEvent(new Event('resize'));
    }

    // 3. Hero Tagline
    const heroTagline = document.querySelector('.hero-tagline');
    if (heroTagline) heroTagline.textContent = data.tagline;

    // 4. Hero Intro
    const heroIntroP = document.querySelector('.hero-intro p');
    if (heroIntroP) heroIntroP.textContent = data.intro;

    // 5. Emails
    document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
      el.href = `mailto:${data.email}`;
      if (el.classList.contains('contact-email')) {
        el.innerHTML = `${escapeHtml(data.email)} <svg class="m-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M8 3l5 5-5 5"/></svg>`;
      }
    });

    // 6. Social Links
    document.querySelectorAll('a[href*="github.com"]').forEach(el => {
      el.href = data.github;
    });
    document.querySelectorAll('a[href*="linkedin.com"]').forEach(el => {
      el.href = data.linkedin;
    });

    // 7. Footer Monument Text
    const monument = document.querySelector('.footer-monument');
    if (monument) monument.textContent = data.wordmark;

    // 8. Document Title
    document.title = `${data.wordmark}: Full Stack, AI & Systems Developer`;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function initCustomizer() {
    const currentData = loadData();
    applyData(currentData);

    // Create customizer UI
    const trigger = document.createElement('button');
    trigger.className = 'customizer-trigger';
    trigger.setAttribute('aria-label', 'Customize portfolio');
    trigger.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
      <span>Customize</span>
    `;

    const modal = document.createElement('div');
    modal.className = 'customizer-modal';
    modal.innerHTML = `
      <div class="customizer-drawer">
        <div class="customizer-header">
          <h2>Portfolio Settings</h2>
          <button class="customizer-close" aria-label="Close settings">&times;</button>
        </div>
        <div class="customizer-body">
          <div class="customizer-tip">
            <strong>Live Preview:</strong> Edits apply instantly to your portfolio and update the interactive particle physics engine in real-time.
          </div>
          <div class="customizer-field">
            <label for="inp-wordmark">Wordmark / Brand Name</label>
            <input type="text" id="inp-wordmark" value="${escapeHtml(currentData.wordmark)}">
          </div>
          <div class="customizer-field">
            <label for="inp-heroname">Particle Text (Hero Display)</label>
            <input type="text" id="inp-heroname" value="${escapeHtml(currentData.heroName)}">
          </div>
          <div class="customizer-field">
            <label for="inp-tagline">Hero Tagline</label>
            <input type="text" id="inp-tagline" value="${escapeHtml(currentData.tagline)}">
          </div>
          <div class="customizer-field">
            <label for="inp-intro">Hero Bio Intro</label>
            <textarea id="inp-intro">${escapeHtml(currentData.intro)}</textarea>
          </div>
          <div class="customizer-field">
            <label for="inp-email">Contact Email</label>
            <input type="email" id="inp-email" value="${escapeHtml(currentData.email)}">
          </div>
          <div class="customizer-field">
            <label for="inp-github">GitHub Profile URL</label>
            <input type="url" id="inp-github" value="${escapeHtml(currentData.github)}">
          </div>
          <div class="customizer-field">
            <label for="inp-linkedin">LinkedIn Profile URL</label>
            <input type="url" id="inp-linkedin" value="${escapeHtml(currentData.linkedin)}">
          </div>
          <div class="customizer-actions">
            <button class="btn btn--secondary" id="btn-reset">Reset</button>
            <button class="btn btn--primary" id="btn-save">Save &amp; Close</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(trigger);
    document.body.appendChild(modal);

    function openModal() {
      modal.classList.add('is-open');
    }

    function closeModal() {
      modal.classList.remove('is-open');
    }

    trigger.addEventListener('click', openModal);
    modal.querySelector('.customizer-close').addEventListener('click', closeModal);
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        modal.classList.toggle('is-open');
      }
    });

    // Real-time live update listeners
    const fields = {
      wordmark: modal.querySelector('#inp-wordmark'),
      heroName: modal.querySelector('#inp-heroname'),
      tagline: modal.querySelector('#inp-tagline'),
      intro: modal.querySelector('#inp-intro'),
      email: modal.querySelector('#inp-email'),
      github: modal.querySelector('#inp-github'),
      linkedin: modal.querySelector('#inp-linkedin')
    };

    function updateFromInputs() {
      const updated = {
        wordmark: fields.wordmark.value.trim() || defaultData.wordmark,
        heroName: fields.heroName.value.trim() || defaultData.heroName,
        tagline: fields.tagline.value.trim() || defaultData.tagline,
        intro: fields.intro.value.trim() || defaultData.intro,
        email: fields.email.value.trim() || defaultData.email,
        github: fields.github.value.trim() || defaultData.github,
        linkedin: fields.linkedin.value.trim() || defaultData.linkedin
      };
      applyData(updated);
      saveData(updated);
    }

    Object.values(fields).forEach(input => {
      input.addEventListener('input', updateFromInputs);
    });

    modal.querySelector('#btn-save').addEventListener('click', () => {
      updateFromInputs();
      closeModal();
    });

    modal.querySelector('#btn-reset').addEventListener('click', () => {
      if (confirm('Reset all customized fields back to default?')) {
        saveData(defaultData);
        Object.keys(fields).forEach(key => {
          fields[key].value = defaultData[key];
        });
        applyData(defaultData);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCustomizer);
  } else {
    initCustomizer();
  }
})();
