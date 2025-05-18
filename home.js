const API_KEY = '27077b0de31705d036e5367a680c8d5f';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';
let currentItem = null;

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("menu-toggle")?.addEventListener("click", () => {
    document.querySelector(".nav-links")?.classList.toggle("show");
  });

  document.getElementById("search-icon")?.addEventListener("click", openSearchModal);
  document.getElementById("search-close")?.addEventListener("click", closeSearchModal);
  document.getElementById("search-input")?.addEventListener("input", searchTMDB);
  document.getElementById("server")?.addEventListener("change", changeServer);
  document.querySelector(".close")?.addEventListener("click", closeModal);

  document.querySelectorAll('.genre-item').forEach(item => {
    item.addEventListener('click', async () => {
      const genreId = item.getAttribute('data-genre-id');
      const movies = await fetchMoviesByGenre(genreId);
      displayList(movies, 'movies-list');
    });
  });

  const trendingMovies = await fetchTrending('movie');
  const trendingTV = await fetchTrending('tv');
  const trendingAnime = await fetchTrendingAnime();
  const popularMovies = await fetchPopularMovies();

  displayBanner(trendingMovies[Math.floor(Math.random() * trendingMovies.length)]);
  displayList(trendingMovies, 'movies-list');
  displayList(trendingTV, 'tvshows-list');
  displayList(trendingAnime, 'anime-list');
  displayList(popularMovies, 'popular-movies-list');
});

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

function showDetails(item) {
  currentItem = item;
  document.getElementById('modal-title').textContent = item.title || item.name;
  document.getElementById('modal-description').textContent = item.overview || 'No description available.';
  document.getElementById('modal-image').src = `${IMG_URL}${item.poster_path}`;
  document.getElementById('modal-rating').innerHTML = '★'.repeat(Math.round(item.vote_average / 2));
  document.getElementById('modal').style.display = 'flex';
  changeServer();
}

async function changeServer() {
  if (!currentItem) return;

  const server = document.getElementById('server').value;
  const type = currentItem.media_type === "tv" ? "tv" : "movie";
  let embedURL = "";

  switch(server) {
    case "apimocine":
      embedURL = `https://apimocine.vercel.app/${type}/${currentItem.id}?autoplay=true`;
      break;
    case "vidsrc.cc":
      embedURL = `https://vidsrc.cc/v2/embed/${type}/${currentItem.id}`;
      break;
    case "vidsrc.me":
      embedURL = `https://vidsrc.net/embed/${type}/?tmdb=${currentItem.id}`;
      break;
    case "player.videasy.net":
      embedURL = `https://player.videasy.net/${type}/${currentItem.id}`;
      break;
    case "2embed":
      try {
        const response = await fetch(`https://2embed.to/api/get_source/${type}?id=${currentItem.id}`);
        const data = await response.json();
        if (data?.sources?.length > 0) {
          embedURL = data.sources[0].file;
        }
      } catch (error) {
        console.error("Error fetching from 2embed API:", error);
      }
      break;
    default:
      embedURL = `https://2embed.to/${type}/${currentItem.id}`;
  }

  const iframe = document.getElementById('modal-video');
  iframe.src = embedURL;
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
  iframe.setAttribute('allowfullscreen', 'true');
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById
