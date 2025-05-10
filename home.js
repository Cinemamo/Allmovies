const TMDB_API_KEY = '27077b0de31705d036e5367a680c8d5f'; // Replace with your actual API key
const BASE_URL = 'https://api.themoviedb.org/3';

function fetchTrendingData() {
  fetch(`${BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`)
    .then(response => response.json())
    .then(data => displayTrendingMovies(data.results));

  fetch(`${BASE_URL}/trending/tv/week?api_key=${TMDB_API_KEY}`)
    .then(response => response.json())
    .then(data => displayTrendingTvShows(data.results));

  fetch(`${BASE_URL}/trending/anime/week?api_key=${TMDB_API_KEY}`)
    .then(response => response.json())
    .then(data => displayTrendingAnime(data.results));
}

function displayTrendingMovies(movies) {
  const moviesList = document.getElementById('movies-list');
  movies.forEach(movie => {
    const img = document.createElement('img');
    img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    img.alt = movie.title;
    img.onclick = () => openModal(movie);
    moviesList.appendChild(img);
  });
}

function displayTrendingTvShows(tvShows) {
  const tvShowsList = document.getElementById('tvshows-list');
  tvShows.forEach(show => {
    const img = document.createElement('img');
    img.src = `https://image.tmdb.org/t/p/w500${show.poster_path}`;
    img.alt = show.name;
    img.onclick = () => openModal(show);
    tvShowsList.appendChild(img);
  });
}

function displayTrendingAnime(animes) {
  const animeList = document.getElementById('anime-list');
  animes.forEach(anime => {
    const img = document.createElement('img');
    img.src = `https://image.tmdb.org/t/p/w500${anime.poster_path}`;
    img.alt = anime.name;
    img.onclick = () => openModal(anime);
    animeList.appendChild(img);
  });
}

function openModal(item) {
  document.getElementById('modal').style.display = 'flex';
  document.getElementById('modal-title').textContent = item.title || item.name;
  document.getElementById('modal-description').textContent = item.overview;
  document.getElementById('modal-image').src = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
  document.getElementById('modal-rating').textContent = `Rating: ${item.vote_average}`;
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

function toggleDisclaimer() {
  const disclaimer = document.getElementById('disclaimer-text');
  disclaimer.classList.toggle('active');
}

function openSearchModal() {
  document.getElementById('search-modal').style.display = 'flex';
}

function closeSearchModal() {
  document.getElementById('search-modal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', fetchTrendingData);
