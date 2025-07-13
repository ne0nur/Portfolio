// JavaScript für den Anruf-Button
document.addEventListener('DOMContentLoaded', function() {
    const button = document.querySelector('.button');
    if (button) {
        button.addEventListener('click', function() {
            window.location.href = 'tel:+4915906155561';
        });
    }
});

// AOS Initialisierung
// Stellen Sie sicher, dass AOS bereits geladen ist, wenn dieser Code ausgeführt wird.
// Das <script src="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js"></script>
// muss vor dieser Datei im HTML stehen.
AOS.init({
    once: false, // Animationen können wiederholt werden
    duration: 1600,
    easing: 'ease-in-out',
    debounceDelay: 50,
    throttleDelay: 99
});