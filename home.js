const apiKey = "27077b0de31705d036e5367a680c8d5f";

function fetchMovies(url, container) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      container.innerHTML = "";
      data.results.forEach((movie) => {
        const poster = movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "https://via.placeholder.com/300x450?text=No+Image";

        const div = document.createElement("div");
        div.classList.add("movie-card");
        div.innerHTML = `<img src="${poster}" alt="${movie.title}" />`;
        div.addEventListener("click", () => openModal(movie.id));
        container.appendChild(div);
      });
    });
}

function openModal(tmdbId) {
  const modal = document.getElementById("modalPlayer");
  const iframe = document.getElementById("videoFrame");

  // Convert TMDB ID to IMDb ID
  fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/external_ids?api_key=${apiKey}`)
    .then((res) => res.json())
    .then((data) => {
      const imdbId = data.imdb_id;
      if (imdbId) {
        iframe.src = `https://vidsrc.to/embed/movie/${imdbId}`;
        modal.style.display = "flex";
      } else {
        alert("No video source available.");
      }
    });
}

// Close Modal
document.getElementById("closeModal").onclick = () => {
  const modal = document.getElementById("modalPlayer");
  const iframe = document.getElementById("videoFrame");
  iframe.src = "";
  modal.style.display = "none";
};

// Fetch sections
fetchMovies(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`, document.getElementById("trendingMovies"));
fetchMovies(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`, document.getElementById("topImdbMovies"));
fetchMovies(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`, document.getElementById("newReleaseMovies"));
