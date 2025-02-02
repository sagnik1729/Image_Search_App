const accessKey = 'k3otGkSHQ1CU5KOJMd7BGk4Mj2gEDRQPA-UztejAKtc';
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const imageContainer = document.getElementById('imageContainer');
const loadMoreButton = document.getElementById('loadMoreButton');
// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const closeBtn = document.getElementsByClassName('close')[0];


const loadingSpinner = document.querySelector('.loading-spinner');

let currentQuery = '';
let page = 1;

searchButton.addEventListener('click', () => {
    currentQuery = searchInput.value.trim();
    if (currentQuery) {
        page = 1;
        imageContainer.innerHTML = '';
        fetchImages();
    }
});

loadMoreButton.addEventListener('click', () => {
    fetchImages();
});

async function fetchImages() {
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${currentQuery}&per_page=10&client_id=${accessKey}`;
    loadingSpinner.style.display = 'block';
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayImages(data.results);
        loadMoreButton.style.display = data.total_pages > page ? 'block' : 'none';
        page++;
    } catch (error) {
        console.error('Error fetching images:', error);
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

function displayImages(images) {
    currentImages = images;
    images.forEach((image , index)=> {
        const card = document.createElement('div');
        card.className = 'image-card';

        const imgElement = document.createElement('img');
        imgElement.src = image.urls.small;
        imgElement.alt = image.alt_description;
        imgElement.style.cursor = 'pointer';
        imgElement.addEventListener('click', () => openLightbox(image, index));

        const caption = document.createElement('p');
        const description = document.createElement('span');

        description.textContent = image.alt_description || 'No description available';
        description.onclick = () => {
            window.open(image.links.html, '_blank');
        };

        const saveButton = document.createElement('button');
        saveButton.className = 'save-button';
        saveButton.innerHTML = `<i class="fa fa-heart" style="color: gray;"></i>`;
        saveButton.addEventListener('click', () => saveImage(image));


        caption.appendChild(description);
        card.appendChild(imgElement);
        card.appendChild(caption);
        card.appendChild(saveButton);
        imageContainer.appendChild(card);
    });
}

function openLightbox(image, index) {
    currentIndex = index;
    lightbox.style.display = 'block';
    lightboxImg.src = image.urls.regular;
    lightboxCaption.textContent = image.alt_description || 'No description available';
}
function updateLightboxImage() {
    if (!currentImages.length || currentIndex < 0 || currentIndex >= currentImages.length) return;
    lightboxImg.style.opacity = 0;
    setTimeout(() => {
        lightboxImg.src = currentImages[currentIndex].urls.regular;
        lightboxCaption.textContent = currentImages[currentIndex].alt_description || 'No description available';
        lightboxImg.style.opacity = 1;
    }, 300);
}

// Add lightbox navigation arrows
const lightboxHTML = `
    <div class="lightbox-nav prev" onclick="showPrevImage()">❮</div>
    <div class="lightbox-nav next" onclick="showNextImage()">❯</div>
`;
document.getElementById('lightbox').insertAdjacentHTML('beforeend', lightboxHTML);
closeBtn.onclick = function () {
    lightbox.style.display = 'none';
}

window.onclick = function (event) {
    if (event.target === lightbox)
        if (event.target === lightbox) {
            lightbox.style.display = 'none';
        }
}
function showNextImage() {
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateLightboxImage();
}
// Add navigation functions
function showPrevImage() {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateLightboxImage();
}
document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'block') {
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    }
});
function saveImage(image) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push(image);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Image saved to favorites!');
}

// Application ID- 704284
// Access Key- k3otGkSHQ1CU5KOJMd7BGk4Mj2gEDRQPA-UztejAKtc
// Secret key- 5E37jMxtt5T8SMj16GJxM40n2cDS96tKMF-h03u39j0