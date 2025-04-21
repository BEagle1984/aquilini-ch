function loadContent(url, elementId) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        })
        .catch(error => console.error('Error loading content:', error, url, elementId));
}

document.addEventListener("DOMContentLoaded", function () {
    loadContent('menu.html', 'menu');
});
