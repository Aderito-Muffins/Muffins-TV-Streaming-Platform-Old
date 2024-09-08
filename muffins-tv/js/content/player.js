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
        const response = await fetch(`${baseApiUrl}films/external/${id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar arquivos do filme');
        }

        const result = await response.json();
        if (result.code !== 0) {
            throw new Error(result.message || 'Erro ao buscar o conteúdo');
        }

        return result.data;
    } catch (error) {
        console.error('Erro ao buscar o conteúdo:', error);
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
    const btPlay = document.querySelector('.vjs-icon-placeholder')
    

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

// Função para configurar o player de vídeo usando Video.js
// Função para configurar o player de vídeo usando Video.js
function setupVideoPlayer(film) {
    const moviePlayer = document.getElementById('movie-player');
    const watchMovieButton = document.getElementById('watch-movie-btn');
    const watchTrailerButton = document.getElementById('watch-trailer-btn');
    const videoHolder = document.getElementById('gen-video-holder');

    if (watchMovieButton) {
        watchMovieButton.addEventListener('click', function () {
            if (moviePlayer && videoHolder) {
                // Inicializa o Video.js player, se ainda não estiver inicializado
                const player = videojs(moviePlayer);

                // Verifica a URL e o tipo de mídia
                const mediaUrl = film.media_url;
                const sourceType = mediaUrl.includes('.m3u8') ? 'application/x-mpegURL' :
                    mediaUrl.includes('.mpd') ? 'application/dash+xml' : 'video/mp4';

               // Verifique se a URL da mídia está correta

                // Atualiza a fonte do player
                player.src({ src: mediaUrl, type: sourceType });

                // Exibe o player de vídeo
                moviePlayer.style.display = 'block'; // Torna o player visível
                videoHolder.style.backgroundImage = 'none'; // Remove o plano de fundo

                // Esconde os botões de assistir ao filme e trailer
                watchMovieButton.style.display = 'none';
                watchTrailerButton.style.display = 'none';

                // Força a reprodução
                player.ready(function () {
                    player.play();
                });
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
