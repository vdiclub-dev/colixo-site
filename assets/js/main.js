document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }
});

(function () {
  const STORAGE_KEY = 'colixo_segment_profile';
  const MANUAL_KEY = 'colixo_segment_manual';

  function getPagePath() {
    return window.location.pathname.toLowerCase();
  }

  function getReferrer() {
    return (document.referrer || '').toLowerCase();
  }

  function isMobile() {
    return window.innerWidth < 768;
  }

  function getCurrentHour() {
    return new Date().getHours();
  }

  function loadProfile() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
        businessScore: 0,
        privateScore: 0,
        pageViews: 0
      };
    } catch (error) {
      return {
        businessScore: 0,
        privateScore: 0,
        pageViews: 0
      };
    }
  }

  function saveProfile(profile) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }

  function getManualSegment() {
    return localStorage.getItem(MANUAL_KEY);
  }

  function setManualSegment(segment) {
    if (segment === 'reset') {
      localStorage.removeItem(MANUAL_KEY);
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
      return;
    }

    localStorage.setItem(MANUAL_KEY, segment);
    window.location.reload();
  }

  window.setSegment = setManualSegment;

  function applyBaseSignals(profile) {
    const path = getPagePath();
    const referrer = getReferrer();
    const hour = getCurrentHour();

    profile.pageViews += 1;

    const businessKeywords = [
      'entreprise',
      'pro',
      'professionnel',
      'tarifs',
      'volume',
      'express',
      'service'
    ];

    const privateKeywords = [
      'particulier',
      'contact',
      'devis-simple'
    ];

    businessKeywords.forEach((keyword) => {
      if (path.includes(keyword)) profile.businessScore += 2;
    });

    privateKeywords.forEach((keyword) => {
      if (path.includes(keyword)) profile.privateScore += 2;
    });

    if (referrer.includes('linkedin')) profile.businessScore += 4;
    if (referrer.includes('google')) profile.businessScore += 1;
    if (referrer.includes('facebook')) profile.privateScore += 1;
    if (referrer.includes('instagram')) profile.privateScore += 1;

    if (isMobile()) {
      profile.privateScore += 1;
    } else {
      profile.businessScore += 1;
    }

    if (hour >= 8 && hour <= 18) {
      profile.businessScore += 1;
    } else {
      profile.privateScore += 1;
    }

    return profile;
  }

  function getDetectedSegment(profile) {
    const manual = getManualSegment();
    if (manual === 'business' || manual === 'private') {
      return manual;
    }

    if (profile.businessScore >= profile.privateScore + 2) {
      return 'business';
    }

    if (profile.privateScore >= profile.businessScore + 2) {
      return 'private';
    }

    return 'mixed';
  }

  function applyHeroContent(segment) {
    const badge = document.getElementById('hero-badge');
    const title = document.getElementById('hero-title');
    const text = document.getElementById('hero-text');
    const cta = document.getElementById('hero-cta');

    if (!badge || !title || !text || !cta) return;

    if (segment === 'business') {
      badge.textContent = 'Solution logistique pour PME';
      title.textContent = 'Une solution de livraison pensée pour les entreprises';
      text.textContent = 'Colixo aide les entreprises de Suisse romande à expédier leurs colis avec plus de souplesse, de réactivité et de simplicité.';
      cta.textContent = 'Demander un devis entreprise';
      cta.href = 'contact.html?segment=business';
      cta.setAttribute('data-segment', 'business');
      return;
    }

    if (segment === 'private') {
      badge.textContent = 'Livraison simple pour particuliers';
      title.textContent = 'Envoyez vos colis facilement en Suisse romande';
      text.textContent = 'Une solution claire, rapide et humaine pour vos envois ponctuels et vos besoins de livraison du quotidien.';
      cta.textContent = 'Envoyer un colis';
      cta.href = 'contact.html?segment=private';
      cta.setAttribute('data-segment', 'private');
      return;
    }

    badge.textContent = 'Livraison en Suisse romande';
    title.textContent = 'Votre livraison de colis, simple et rapide';
    text.textContent = 'Une solution flexible en Suisse romande pour particuliers et entreprises.';
    cta.textContent = 'Être contacté';
    cta.href = 'contact.html';
    cta.setAttribute('data-segment', 'mixed');
  }

  function bindTracking(profile) {
    document.querySelectorAll('[data-segment]').forEach((element) => {
      element.addEventListener('click', function () {
        const segment = this.getAttribute('data-segment');

        if (segment === 'business') {
          profile.businessScore += 3;
        }

        if (segment === 'private') {
          profile.privateScore += 3;
        }

        saveProfile(profile);
      });
    });
  }

  let profile = loadProfile();
  profile = applyBaseSignals(profile);
  saveProfile(profile);

  const detectedSegment = getDetectedSegment(profile);
  applyHeroContent(detectedSegment);
  bindTracking(profile);

  console.log('Colixo segment detecte :', detectedSegment, profile);
})();
