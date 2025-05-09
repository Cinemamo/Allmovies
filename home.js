const API_KEY = '27077b0de31705d036e5367a680c8d5f';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';

// Function para mag-fetch ng movies ayon sa genre
async function fetchGenreMovies(genreId) {
    const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`);
    const data = await res.json();
    return data.results;
}

// Function para mag-display ng genre links
function displayGenres() {
    const genres = [
        { name: 'Action', id: 28 },
        { name: 'Adventure', id: 12 },
        { name: 'Comedy', id: 35 },
        { name: 'Drama', id: 18 },
        { name: 'Horror', id: 27 },
        { name: 'Romance', id: 10749 },
        { name: 'Sci-Fi', id: 878 },
        { name: 'Thriller', id: 53 },
        { name: 'Fantasy', id: 14 },
        // Pwede mo pa idagdag ang ibang genres dito
    ];

    const genresContainer = document.getElementById('genre-links');
    genresContainer.innerHTML = ''; // Linisin ang mga dating genre links

    genres.forEach(genre => {
        const genreLink = document.createElement('a');
        genreLink.href = '#';
        genreLink.textContent = genre.name;
        genreLink.onclick = (e) => {
            e.preventDefault();
            loadMoviesByGenre(genre.id); // Mag-load ng movies ayon sa genre ID
        };
        genresContainer.appendChild(genreLink);
    });
}

// Function para mag-load at mag-display ng movies ng isang genre
async function loadMoviesByGenre(genreId) {
    const movies = await fetchGenreMovies(genreId);
    displayMovieList(movies, 'movies-list');
}

// Function para mag-display ng movie posters
function displayMovieList(movies, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    movies.forEach(movie => {
        const movieImg = document.createElement('img');
        movieImg.src = `${IMG_URL}${movie.poster_path}`;
        movieImg.alt = movie.title;
        movieImg.onclick = () => showDetails(movie);
        container.appendChild(movieImg);
    });
}

// Function para ipakita ang details ng movie sa modal
function showDetails(movie) {
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('modal-title').textContent = movie.title;
    document.getElementById('modal-description').textContent = movie.overview;
    document.getElementById('modal-image').src = `${IMG_URL}${movie.poster_path}`;
}

// Initial na pag-load ng genre menu at mga pelikula (halimbawa, Action movies)
document.addEventListener('DOMContentLoaded', () => {
    displayGenres(); // Mag-load ng genre links
    loadMoviesByGenre(28); // Mag-load ng Action movies by default (ID 28)
});

// Function para i-toggle ang visibility ng genre menu
function toggleMenu() {
    const genreMenu = document.getElementById('genre-menu');
    genreMenu.classList.toggle('show'); // I-toggle ang visibility ng genre menu
}
