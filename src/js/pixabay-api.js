import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '39071342-12c5b8525c889ca7019ed7d4b';

export class PixabayApi {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 5;
    this.totalHits = 0;
  }

  async fetchImages() {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: this.searchQuery,
        page: this.page,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: this.per_page,
      },
    });

    this.totalHits = response.data.totalHits;

    return response.data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
