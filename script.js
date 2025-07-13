document.addEventListener('DOMContentLoaded', function() {
  const nav = document.getElementById('main-nav');
  // Annahme: Die Hero-Sektion ist die erste Section oder der Header selbst
  // und nimmt die volle Viewport-Höhe ein (h-screen).
  // Wir nehmen die Höhe des Fensters als Referenz.
  const heroHeight = window.innerHeight; // Dies sollte die Höhe deiner Hero-Sektion sein

  function updateNavbar() {
    // Wenn die Scrollposition größer ist als die Höhe der Hero-Sektion
    // minus der Höhe der Navigation (für einen sanfteren Übergang)
    if (window.scrollY > heroHeight - nav.offsetHeight) {
      nav.classList.add('scrolled'); // Füge die 'scrolled' Klasse hinzu
    } else {
      nav.classList.remove('scrolled'); // Entferne die 'scrolled' Klasse
    }
  }

  // Initial aufrufen, falls die Seite nicht ganz oben geladen wird
  updateNavbar();

  // Event Listener für Scroll-Events
  window.addEventListener('scroll', updateNavbar);

  // Smooth Scrolling für Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      // Verhindere Scrollen, wenn der Link nur '#' ist
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Berechne die Zielposition, um den feststehenden Header zu berücksichtigen
        const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY;
        const finalScrollPosition = offsetTop - nav.offsetHeight; // Ziehe die Höhe der Navigation ab

        window.scrollTo({
          top: finalScrollPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});