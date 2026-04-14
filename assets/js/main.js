document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }
});

function setSegment(segment) {
  var badge = document.getElementById('hero-badge');
  var title = document.getElementById('hero-title');
  var text = document.getElementById('hero-text');
  var cta = document.getElementById('hero-cta');

  if (!badge || !title || !text || !cta) {
    return;
  }

  if (segment === 'business') {
    badge.textContent = 'Livraison pour entreprises';
    title.textContent = 'Votre livraison de colis, pensée pour votre entreprise';
    text.textContent = 'Une solution souple pour les PME, commerces et structures actives en Suisse romande.';
    cta.textContent = 'Être contacté';
    cta.setAttribute('href', 'contact.html');
    return;
  }

  if (segment === 'private') {
    badge.textContent = 'Livraison pour particuliers';
    title.textContent = 'Une livraison de colis simple pour vos besoins du quotidien';
    text.textContent = 'Un service pratique en Suisse romande pour envoyer, recevoir ou organiser une remise rapidement.';
    cta.textContent = 'Demander une info';
    cta.setAttribute('href', 'contact.html');
    return;
  }

  badge.textContent = 'Livraison en Suisse romande';
  title.textContent = 'Votre livraison de colis, simple et rapide';
  text.textContent = 'Une solution flexible en Suisse romande pour particuliers et entreprises.';
  cta.textContent = 'Être contacté';
  cta.setAttribute('href', 'contact.html');
}
