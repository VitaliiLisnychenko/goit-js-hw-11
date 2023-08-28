import { PixabayApi } from './js/pixabay-api';
import Notiflix from 'notiflix';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreEl = document.querySelector('.load-more');

formEl.addEventListener('submit', onFormSubmit);
loadMoreEl.addEventListener('click', onLoadMore);

const pixabayApi = new PixabayApi();

let lightbox = new simpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionSelector: 'img',
  captionPosition: 'bottom',
  captionDelay: 250,
});

Notiflix.Notify.init({
  position: 'center-center',
});

function createMarkup({ hits }) {
  const markupImg = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
          <a class="photo-link" href="${largeImageURL}">
        <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b> ${likes}
          </p>
          <p class="info-item">
            <b>Views</b> ${views}
          </p>
          <p class="info-item">
            <b>Comments</b> ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b> ${downloads}
          </p>
        </div>
      </div>`;
      }
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markupImg);
  lightbox.refresh();
}
async function renderImages() {
  try {
    const images = await pixabayApi.fetchImages();
    console.log(pixabayApi.page);
    if (images.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreEl.classList.add('hidden');
      return;
    }

    createMarkup(images);

    if (pixabayApi.page === 1 && pixabayApi.totalHits !== 0) {
      Notiflix.Notify.success(
        `Hooray! We found ${pixabayApi.totalHits} images.`
      );
      if (pixabayApi.totalHits > pixabayApi.per_page) {
        loadMoreEl.classList.remove('hidden');
      } else {
        loadMoreEl.classList.add('hidden');
      }
    }
  } catch (error) {
    Notiflix.Notify.failure('Something went wrong!');
  }
}
function onFormSubmit(evt) {
  evt.preventDefault();
  if (!evt.target.elements.searchQuery.value.trim()) {
    Notiflix.Notify.info('Please, write something');
    return;
  }
  Notiflix.Loading.hourglass('Loading data, please wait...');
  galleryEl.innerHTML = '';
  pixabayApi.resetPage();
  pixabayApi.query = evt.target.elements.searchQuery.value;
  renderImages();
  Notiflix.Loading.remove();
}
async function onLoadMore() {
  pixabayApi.incrementPage();

  if (pixabayApi.page < Math.ceil(pixabayApi.totalHits / pixabayApi.per_page)) {
    loadMoreEl.classList.remove('hidden');
  } else {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    loadMoreEl.classList.add('hidden');
  }
  await renderImages();
}
