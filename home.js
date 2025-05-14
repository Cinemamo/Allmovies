const API_KEY = '27077b0de31705d036e5367a680c8d5f';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';
let currentItem = null;
let searchTimeout = null;

document.addEventListener("DOMContentLoaded", async () => {
  // Navbar toggles
  document.getElementById("menu-toggle")?.addEventListener("click", () => {
    document.querySelector(".nav-links")?.classList.toggle("show");
  });

  // Search modal events
  document.getElementById("search-icon")?.addEventListener("click", openSearchModal);
  document.getElementById("search-close")?.addEventListener("click", closeSearchModal);
  document.getElementById("search-input")?.addEventListener("input", debounceSearch);

  // Server and modal controls
  document.getElementById("server")?.addEventListener("change", changeServer);
  document.querySelector(".close")?.addEventListener("click", closeModal);

  // Genre events
  document.querySelectorAll('.genre-item').forEach(item => {
    item.addEventListener('click', async () => {
      const genreId = item.getAttribute('data-genre-id');
      const movies = await fetchMoviesByGenre(genreId);
      displayList(movies, 'movies-list');
    });
  });

  // Load only trending movies initially
  const trendingMovies = await fetchTrending('movie');
  displayBanner(trendingMovies[Math.floor(Math.random() * trendingMovies.length)]);
  displayList(trendingMovies, 'movies-list');

  // Lazy load the rest after a delay
  setTimeout(async () => {
    const [trendingTV, trendingAnime, popularMovies] = await Promise.all([
      fetchTrending('tv'),
      fetchTrendingAnime(),
      fetchPopularMovies()
    ]);
    displayList(trendingTV, 'tvshows-list');
    displayList(trendingAnime, 'anime-list');
    displayList(popularMovies, 'popular-movies-list');
  }, 1000);
});

// TMDB fetch functions
async function fetchPopularMovies() {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
}

async function fetchTrending(type) {
  const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
}

async function fetchTrendingAnime() {
  let results = [];
  for (let page = 1; page <= 2; page++) {
    const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${page}`);
    const data = await res.json();
    const filtered = data.results.filter(item =>
      item.original_language === 'ja' && item.genre_ids.includes(16)
    );
    results = results.concat(filtered);
  }
  return results;
}

async function fetchMoviesByGenre(genreId) {
  const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`);
  const data = await res.json();
  return data.results;
}

// Display movie lists
function displayList(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  items.forEach(item => {
    if (!item.poster_path) return;

    const div = document.createElement('div');
    div.classList.add('movie');
    const img = document.createElement('img');
    img.src = `${IMG_URL}${item.poster_path}`;
    img.alt = item.title || item.name;
    img.addEventListener('click', () => showDetails(item));
    div.appendChild(img);
    container.appendChild(div);
  });
}

function displayBanner(item) {
  document.getElementById('banner').style.backgroundImage = `url(${IMG_URL}${item.backdrop_path})`;
  document.getElementById('banner-title').textContent = item.title || item.name;
}

// Modal detail display
function showDetails(item) {
  currentItem = item;
  document.getElementById('modal-title').textContent = item.title || item.name;
  document.getElementById('modal-description').textContent = item.overview || 'No description available.';
  document.getElementById('modal-image').src = `${IMG_URL}${item.poster_path}`;
  document.getElementById('modal-rating').innerHTML = '★'.repeat(Math.round(item.vote_average / 2));
  document.getElementById('modal').style.display = 'flex';
  changeServer();
}

// Server switching with loader
function changeServer() {
  if (!currentItem) return;

  const loader = document.getElementById('video-loader');
  const iframe = document.getElementById('modal-video');
  loader.style.display = 'block';
  iframe.style.display = 'none';

  const server = document.getElementById('server').value;
  const type = currentItem.media_type === "tv" ? "tv" : "movie";
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

  iframe.src = embedURL;
  iframe.onload = () => {
    loader.style.display = 'none';
    iframe.style.display = 'block';
  };
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
}

// Close modal
function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal-video').src = '';
}

// Search functionality with debounce
function debounceSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(searchTMDB, 500);
}

async function searchTMDB() {
  const query = document.getElementById('search-input').value.trim();
  if (!query) return;

  const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${query}`);
  const data = await res.json();
  const container = document.getElementById('search-results');
  container.innerHTML = '';

  data.results.forEach(item => {
    if (!item.poster_path) return;
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

// Search modal open/close
function openSearchModal() {
  document.getElementById('search-modal').style.display = 'flex';
  document.getElementById('search-input').focus();
}

function closeSearchModal() {
  document.getElementById('search-modal').style.display = 'none';
  document.getElementById('search-results').innerHTML = '';
}

// Horizontal scroll (carousel)
function scrollList(id, direction) {
  const container = document.getElementById(id);
  const scrollAmount = 300 * direction;
  container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}

// Hide intro disclaimer
function hideIntro() {
  document.getElementById("intro-disclaimer").style.display = "none";
}
