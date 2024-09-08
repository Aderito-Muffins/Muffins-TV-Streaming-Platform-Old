// Função para obter o parâmetro 'id' da URL
function getIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// URL base da API para obter os detalhes do filme
const baseApiUrl = 'http://localhost:3000/muffins/v1/';
const filmId = getIdFromURL();

// Função para buscar os detalhes do filme da API
async function fetchMovieDetails(id) {
    try {
        const response = await fetch(`${baseApiUrl}films/id/${id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar dados do filme');
        }

        const result = await response.json();
        if (result.code !== 0) {
            throw new Error(result.message || 'Erro ao buscar o filme');
        }

        return result.data;
    } catch (error) {
        console.error('Erro ao buscar o filme:', error);
        return null;
    }
}

async function fetchContentDetails(id) {
    try {
        const response = await fetch(`${baseApiUrl}/content/fileid/${id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar files do filme');
        }

        const result = await response.json();
        if (result.code !== 0) {
            throw new Error(result.message || 'Erro ao buscar o conteudo');
        }

        return result.data;
    } catch (error) {
        console.error('Erro ao buscar o conteudo:', error);
        return null;
    }
}

// Função para exibir os detalhes do filme no HTML
function displayFilmDetails(film) {
    if (!film) {
        alert('Não foi possível carregar os detalhes do filme.');
        return;
    }

    // Verificações para garantir que os elementos existem antes de acessá-los
    const titleElement = document.querySelector('.gen-title');
    const descriptionElement = document.querySelector('.gen-description');
    const ratingElement = document.querySelector('.gen-sen-rating');
    const viewsElement = document.querySelector('.gen-single-meta-holder .fas.fa-eye + span');
    const languageElement = document.querySelector('#film-language');
    const subtitlesElement = document.querySelector('#film-subtitles');
    const durationElement = document.querySelector('#film-duration');
    const yearElement = document.querySelector('#film-year');
    const qualityElement = document.querySelector('#film-quality');
    const actorsElement = document.querySelector('#film-actors');
    const genreElement = document.querySelector('#film-genre');

    // Atualiza o conteúdo dos elementos, se eles existirem
    if (titleElement) titleElement.textContent = film.title || 'Título não disponível';
    if (descriptionElement) descriptionElement.textContent = film.brief || 'Descrição não disponível';
    if (ratingElement) ratingElement.textContent = film.age || 'N/A';
    if (viewsElement) viewsElement.textContent = `${film.views || 0} Views`;
    if (languageElement) languageElement.textContent = film.nation || 'N/A';
    if (subtitlesElement) subtitlesElement.textContent = film.sub_mode?.map(sub => sub.title).join(', ') || 'N/A';
    if (durationElement) durationElement.textContent = film.duration || 'N/A';
    if (yearElement) yearElement.textContent = film.published_year || 'N/A';
    if (qualityElement) qualityElement.textContent = film.hd_mode || 'N/A';
    if (actorsElement) actorsElement.textContent = film.actors?.map(actor => actor.title).join(', ') || 'N/A';
    if (genreElement) genreElement.textContent = film.category?.map(category => category.title).join(', ') || 'N/A';

    // Define a imagem de capa
    const videoHolder = document.getElementById('gen-video-holder');
    if (videoHolder) {
        videoHolder.style.backgroundImage = `url('${film.cover}')`;
    }
}

// Função para configurar o player de vídeo
function setupVideoPlayer(film) {
    const moviePlayer = document.getElementById('movie-player');
    const videoHolder = document.getElementById('gen-video-holder');

    const watchMovieButton = document.getElementById('watch-movie-btn');
    const watchTrailerButton = document.getElementById('watch-trailer-btn');

    if (watchMovieButton) {
        watchMovieButton.addEventListener('click', function () {
            if (moviePlayer) {
                const sourceElement = document.createElement('source');
                sourceElement.src = film.url; // URL do filme obtida da API
                sourceElement.type = 'video/mp4';
                moviePlayer.appendChild(sourceElement);

                videoHolder.style.backgroundImage = 'none'; // Remove a imagem de capa
                moviePlayer.style.display = 'block'; // Exibe o player de vídeo
                moviePlayer.play(); // Inicia a reprodução do filme
            }
        });
    }

    if (watchTrailerButton) {
        watchTrailerButton.addEventListener('click', function () {
            window.open(film.trailerUrl, '_blank'); // Redireciona para o trailer no YouTube
        });
    }
}

// Inicialização ao carregar o DOM
document.addEventListener("DOMContentLoaded", async function () {
    const film = await fetchMovieDetails(filmId);
    const content = await fetchContentDetails(filmId);
    displayFilmDetails(film);
    setupVideoPlayer(content);
});
