document.addEventListener("DOMContentLoaded", () => {
    // Example of adding dynamic content or features
    const videoItems = document.querySelectorAll('.video-item');

    videoItems.forEach(item => {
        item.addEventListener('click', () => {
            alert(`You clicked on ${item.querySelector('h4').textContent}`);
            // You can redirect to a video playback page here
        });
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const showMapButton = document.getElementById('showMap');
    const mapDiv = document.getElementById('map');

    showMapButton.addEventListener('click', () => {
        if (mapDiv.classList.contains('hidden')) {
            mapDiv.classList.remove('hidden');
            showMapButton.textContent = 'Hide Location';
        } else {
            mapDiv.classList.add('hidden');
            showMapButton.textContent = 'View Location on Map';
        }
    });
});