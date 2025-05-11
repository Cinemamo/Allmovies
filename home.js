const apiKey = "27077b0de31705d036e5367a680c8d5f";
const trendingContainer = document.getElementById("trendingMovies");
const topImdbContainer = document.getElementById("topImdbMovies");
const newReleaseContainer = document.getElementById("newReleaseMovies");

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
        div.innerHTML = `
          <img src="${posterPath}" alt="${movie.title}" />
        `;
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
  const modal = document.getElementById("modalPlayer");
  const iframe = document.getElementById("videoFrame");
  iframe.src = `https://vidsrc.to/embed/movie/${movie.id}`;
  modal.style.display = "flex";
}

document.getElementById("closeModal").onclick = () => {
  const modal = document.getElementById("modalPlayer");
  const iframe = document.getElementById("videoFrame");
  modal.style.display = "none";
  iframe.src = "";
};

// Load sections
fetchMovies(`https://api.themoviedb.org/3/trending/movie/day?api_key=${27077b0de31705d036e5367a680c8d5f}`, trendingContainer);
fetchMovies(`https://api.themoviedb.org/3/movie/top_rated?api_key=${27077b0de31705d036e5367a680c8d5f}`, topImdbContainer);
fetchMovies(`https://api.themoviedb.org/3/movie/now_playing?api_key=${27077b0de31705d036e5367a680c8d5f}`, newReleaseContainer);
