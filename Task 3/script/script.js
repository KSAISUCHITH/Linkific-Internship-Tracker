const body = document.body;
const toggleButton = document.querySelector('.theme-toggle');
const galleryButton = document.getElementById('viewGalleryBtn');
const banner = document.getElementById('statusBanner');
const cards = document.querySelectorAll('.box');

function showMessage(message) {
    if (!banner) return;

    banner.textContent = message;
    banner.classList.add('visible');

    clearTimeout(showMessage.timer);
    showMessage.timer = setTimeout(() => {
        banner.classList.remove('visible');
    }, 1800);
}

toggleButton.addEventListener('click', function () {
    body.classList.toggle('dark-theme');
});

galleryButton.addEventListener('click', function () {
    document.getElementById('gallery').scrollIntoView({
        behavior: 'smooth'
    });
    showMessage('Gallery opened');
});

cards.forEach(function (card) {
    card.addEventListener('mouseenter', function () {
        card.classList.add('flipped');
    });

    card.addEventListener('mouseleave', function () {
        card.classList.remove('flipped');
    });

    card.addEventListener('click', function () {
        cards.forEach(function (item) {
            item.classList.remove('active');
        });

        card.classList.add('active');
        const title = card.dataset.title || 'Selected image';
        showMessage(title + ' selected');
    });
});
