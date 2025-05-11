const apiKey = "27077b0de31705d036e5367a680c8d5f";
const trendingContainer = document.getElementById("trendingMovies");
const topImdbContainer = document.getElementById("topImdbMovies");
const newReleaseContainer = document.getElementById("newReleaseMovies");
const modal = document.getElementById("modalPlayer");
const iframe = document.getElementById("videoFrame");
const serverSelect = document.getElementById("serverSelect");

const embedServers = {
  vidsrc: (imdb_id) => `https://vidsrc.to/embed/movie/${imdb_id}`,
  multiembed: (imdb_id) => `https://multiembed.mov/?video_id=${imdb_id}&tmdb=1`,
  twoEmbed: (tmdb_id) => `https://www.2embed.to/embed/tmdb/movie?id=${tmdb_id}`,
  vidplay: (imdb_id) => `https://vidplay.to/embed/${imdb_id}`,
  upcloud: (imdb_id) => `https://upcloud.lol/embed/${imdb_id}`,
};

function fetchMovies(url, container) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      container.innerHTML = "";
      data.results.forEach((movie) => {
        const posterPath = movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : `https://via.placeholder.com/300x450?text=No+Image`;

        const div = document.createElement("div");
        div.classList.add("movie-card");
        div.innerHTML = `<img src="${posterPath}" alt="${movie.title}" />`;
        div.addEventListener("click", () => openModal(movie));
        container.appendChild(div);
      });
    })
    .catch((error) => {
      console.error("Error fetching movies:", error);
      container.innerHTML = "<p>Failed to load movies.</p>";
    });
}

function openModal(movie) {
  // Get IMDb ID from TMDB
  fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`)
    .then((res) => res.json())
    .then((data) => {
      const imdb_id = data.imdb_id;
      const tmdb_id = movie.id;

      serverSelect.innerHTML = "";
      Object.entries(embedServers).forEach(([name, buildUrl]) => {
        const option = document.createElement("option");
        option.value = buildUrl(name === "twoEmbed" ? tmdb_id : imdb_id);
        option.textContent = name.toUpperCase();
        serverSelect.appendChild(option);
      });

      serverSelect.onchange = () => {
        iframe.src = serverSelect.value;
      };

      iframe.src = serverSelect.value;
      modal.style.display = "flex";
    })
    .catch((err) => console.error("Error getting IMDb ID:", err));
}

document.getElementById("closeModal").onclick = () => {
  modal.style.display = "none";
  iframe.src = "";
};

fetchMovies(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`, trendingContainer);
fetchMovies(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`, topImdbContainer);
fetchMovies(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`, newReleaseContainer);
