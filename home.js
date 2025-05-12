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

  document.querySelectorAll('.genre-menu a').forEach(item => {
  item.addEventListener('click', async () => {
    const genreId = item.getAttribute('data-genre-id'); // Kukunin ang genre ID mula sa link
    const movies = await fetchMoviesByGenre(genreId);  // Kukunin ang movies based sa genre ID
    displayList(movies, 'movies-list');  // I-display ang mga movie sa container
  });
});

async function fetchMoviesByGenre(genreId) {
  const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`);
  const data = await res.json();
  return data.results;  // Return the list of movies for that genre
}

}

function displayList(items, containerId) {
function displayList(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = ''; // Clear previous movies if any

  items.forEach(item => {
    const movieItem = document.createElement('div');
    movieItem.classList.add('movie-item');

    const movieImage = document.createElement('img');
    movieImage.src = `${IMG_URL}${item.poster_path}`;
    movieImage.alt = item.title || item.name;
    movieItem.appendChild(movieImage);

    const movieTitle = document.createElement('p');
    movieTitle.textContent = item.title || item.name;
    movieItem.appendChild(movieTitle);

    // Add click listener to show details on modal
    movieItem.addEventListener('click', () => showDetails(item));

    container.appendChild(movieItem);
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

function changeServer() {
  if (!currentItem) return;
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

  const iframe = document.getElementById('modal-video');
  iframe.src = embedURL;
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal-video').src = '';
}

function openSearchModal() {
  document.getElementById('search-modal').style.display = 'flex';
  document.getElementById('search-input').focus();
}

function closeSearchModal() {
  document.getElementById('search-modal').style.display = 'none';
  document.getElementById('search-results').innerHTML = '';
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

function scrollList(id, direction) {
  const container = document.getElementById(id);
  const scrollAmount = 300 * direction;
  container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}
