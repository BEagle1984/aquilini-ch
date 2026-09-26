function markCurrentPage(menu) {
    const path = window.location.pathname.replace(/\/index\.html$/, '/') || '/';
    menu.querySelectorAll('a').forEach(link => {
        if (new URL(link.href).pathname === path) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const menu = document.getElementById('menu');
    markCurrentPage(menu);
    try {
        const response = await fetch('menu.html');
        if (!response.ok) throw new Error(`Menu request failed: ${response.status}`);
        menu.innerHTML = await response.text();
        markCurrentPage(menu);
    } catch (error) {
        // Keep the inline navigation available when the shared menu cannot load.
        console.error('Error loading navigation:', error);
    }
});
