const API_KEY = '27077b0de31705d036e5367a680c8d5f';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';
let currentItem;

document.addEventListener("DOMContentLoaded", () => {
  // Toggle the hamburger menu
  document.getElementById("menu-toggle").addEventListener("click", () => {
    document.querySelector(".nav-links").classList.toggle("show");
  });

  // Modal event listeners
  document.getElementById("search-icon").addEventListener("click", openSearchModal);
  document.getElementById("search-close").addEventListener("click", closeSearchModal);
  document.getElementById("search-input").addEventListener("input", searchTMDB);
  document.getElementById("server").addEventListener("change", changeServer);
  document.querySelector(".close").addEventListener("click", closeModal);

  // Genre item click event
  document.querySelectorAll('.genre-item').forEach(item => {
    item.addEventListener('click', async () => {
      const genreId = item.getAttribute('data-genre-id');
      const movies = await fetchMoviesByGenre(genreId);
      displayList(movies, 'movies-list');
    });
  });
});

// Fetch trending movies
async function fetchTrending(type) {
  const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
}

// Fetch trending anime shows
async function fetchTrendingAnime() {
  let results = [];
  for (let page = 1; page <= 3; page++) {
    const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${page}`);
    const data = await res.json();
    const filtered = data.results.filter(item =>
      item.original_language === 'ja' && item.genre_ids.includes(16)
    );
    results = results.concat(filtered);
  }
  return results;
}

// Fetch movies by genre
async function fetchMoviesByGenre(genreId) {
  const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`);
  const data = await res.json();
  return data.results;
}

// Display the banner with a random movie or TV show
function displayBanner(item) {
  document.getElementById('banner').style.backgroundImage = `url(${IMG_URL}${item.backdrop_path})`;
  document.getElementById('banner-title').textContent = item.title || item.name;
}

// Display the list of items (movies, tv shows, etc.)
function displayList(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = ''; // Clear the container before adding new items
  items.forEach(item => {
    const img = document.createElement('img');
    img.src = `${IMG_URL}${item.poster_path}`;
    img.alt = item.title || item.name;
    img.addEventListener('click', () => showDetails(item)); // Show details when clicked
    container.appendChild(img);
  });
}

// Show the details of a selected item in a modal
function showDetails(item) {
  currentItem = item;
  document.getElementById('modal-title').textContent = item.title || item.name;
  document.getElementById('modal-description').textContent = item.overview;
  document.getElementById('modal-image').src = `${IMG_URL}${item.poster_path}`;
  document.getElementById('modal-rating').innerHTML = '★'.repeat(Math.round(item.vote_average / 2));
  changeServer(); // Change the server for the video
  document.getElementById('modal').style.display = 'flex'; // Show the modal
}

// Change the video server
function changeServer() {
  const server = document.getElementById('server').value;
  const type = currentItem.media_type === "movie" ? "movie" : "tv";
  let embedURL = "";

  if (server === "apimocine") {
    embedURL = `https://apimocine.vercel.app/${type}/${currentItem.id}?autoplay=true`;
  } else if (server === "vidsrc.cc") {
    embedURL = `https://vidsrc.cc/v2/embed/${type}/${currentItem.id}`;
  } else if (server === "vidsrc.me") {
    embedURL = `https://vidsrc.net/embed/${type}/?tmdb=${currentItem.id}`;
  } else if (server === "player.videasy.net") {
    embedURL = `https://player.videasy.net/${type}/${currentItem.id}`;
  }

  const iframe = document.getElementById('modal-video');
  iframe.src = embedURL;
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
}

// Close the modal
function closeModal() {
  document.getElementById('modal').style.display = 'none';
  const iframe = document.getElementById('modal-video');
  iframe.src = ''; // Clear the iframe source
}

// Open the search modal
function openSearchModal() {
  document.getElementById('search-modal').style.display = 'flex';
  document.getElementById('search-input').focus();
}

// Close the search modal
function closeSearchModal() {
  document.getElementById('search-modal').style.display = 'none';
  document.getElementById('search-results').innerHTML = ''; // Clear search results
}

// Search TMDB based on input
async function searchTMDB() {
  const query = document.getElementById('search-input').value;
  if (!query.trim()) return; // If input is empty, do nothing

  const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${query}`);
  const data = await res.json();

  const container = document.getElementById('search-results');
  container.innerHTML = ''; // Clear previous search results
  data.results.forEach(item => {
    if (!item.poster_path) return; // Skip items without a poster
    const img = document.createElement('img');
    img.src = `${IMG_URL}${item.poster_path}`;
    img.alt = item.title || item.name;
    img.addEventListener("click", () => {
      closeSearchModal();
      showDetails(item);
    });
    container.appendChild(img);
  });
}

// Initialize the page
async function init() {
  const movies = await fetchTrending('movie');
  const tvShows = await fetchTrending('tv');
  const anime = await fetchTrendingAnime();

  displayBanner(movies[Math.floor(Math.random() * movies.length)]);
  displayList(movies, 'movies-list');
  displayList(tvShows, 'tvshows-list');
  displayList(anime, 'anime-list');
}

init(); // Call init to load data when the page loads
