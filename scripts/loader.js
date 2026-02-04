/* Loader Logic */
document.addEventListener("DOMContentLoaded", () => {
    const splash = document.getElementById('splash-screen');

    // Minimum time to show splash (3000ms = 3 seconds)
    const minTime = 3000;
    const start = Date.now();

    window.addEventListener('load', () => {
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, minTime - elapsed);

        setTimeout(() => {
            splash.classList.add('hidden');

            // Remove from DOM strictly after transition
            setTimeout(() => {
                splash.remove();
            }, 800);
        }, remaining);
    });
});
