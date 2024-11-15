const baseUrl = "http://localhost:3000/muffins/v1";
let StrangeUrl;
let serverId = "";
let epNumber = "";
let t = "";
let i = "";
let s = "";
let image;

function showLoading() {
    document.querySelector('.loader-container').style.display = 'flex';
}

function hideLoading() {
    document.querySelector('.loader-container').style.display = 'none';
}

const paymentModal = document.getElementById('paymentModal');
const closeModal = document.getElementById('closeModal');

document.addEventListener("DOMContentLoaded", loadSeasonsAndEpisodes);

async function loadSeasonsAndEpisodes() {
    showLoading()
    try {
        const urlParams = new URLSearchParams(window.location.search);
        i = urlParams.get('i');
        s = urlParams.get('s');
        t = urlParams.get('t');

        epNumber = urlParams.get('ep');

        if (!i) {
            throw new Error("animeId não encontrado na URL.");
        }

        const animeData = await fetchContentData(i);
        updateContentInfo(animeData);

        // StrangeUrl = ''
        // const activeAnimeId ="2"



        if (!s) {
            const [seasonsHtml] = await Promise.all([
                createSeasonItems(animeData.data.seasons),
            ]);
            updateCarousel(seasonsHtml);
        } else {
            const [seasonsHtml, episodesHtml] = await Promise.all([
                createSeasonItems(animeData.data.seasons),
                loadEpisodes(animeData.data)]);
                updateCarousel(seasonsHtml);
                document.getElementById('eps').innerHTML = episodesHtml;
        }

    
       

        setupVideoPlayer();
    } catch (error) {
        console.error("Erro ao carregar temporadas e episódios:", error);
    } finally {
        hideLoading(); // Garante que o loading será escondido
    }

}

async function fetchContentData(i) {
    const response = await fetch(`${baseUrl}/post/${t}/${i}`);
    if (response.code == 0) throw new Error('Erro ao buscar dados do anime');
    return response.json();
}

function updateContentInfo(animeData) {
    console.log(animeData)
    const title = animeData.data.name;
    const poster = animeData.data.backdrop;
    image = animeData.data.poster;
    const premiered = animeData.data.year;
    const views = animeData.data.total_views;
    const overview = animeData.data.description;
    const genres = animeData.data.genres.map(genre => ` ${genre.name}`);
    const genresList = genres || "NULL";
    const lang = animeData.data.lang;
    const premieredValue = premiered || "NULL";
    const moviePlayer = document.getElementById('movie-player');
    moviePlayer.style.background = 'rgba(0, 0, 0, 0.5)';

    const videoHolder = document.getElementById('gen-video-holder');
    if (videoHolder) {
        videoHolder.style.backgroundImage = `url(${poster})`;
    }

    document.querySelector(".gen-single-tv-show-info").innerHTML += `
        <h2 class="gen-title">${title}</h2>
        <div class="gen-single-meta-holder">
            <ul>
                <li class="gen-sen-rating">Classificação: ${animeData.data.rating.rating}</li>
                <li><i class="fas fa-eye"></i><span>${views || 0} Views</span></li>
            </ul>
        </div>
        <p class="gen-description">${overview}</p>
        <div class="gen-after-excerpt">
            <div class="gen-extra-data">
                <ul>
                    <li><span>Gênero:</span><span id="film-genre">${genresList}</span></li>
                    <li><span>Lang:</span><span id="film-duration">${lang}</span></li>
                    <li><span>Lançamento:</span><span id="film-year">${premieredValue}</span></li>
                </ul>
            </div>
        </div>
    `;
}

async function createSeasonItems(seasons) {
    if (!Array.isArray(seasons)) {
        console.error('O objeto de temporadas não é um array:', seasons);
        return '';
    }

    const seasonItems = await Promise.all(seasons.map(async (season, index) => {


        return `
        <div class="item ">
            <div class="movie type-movie status-publish has-post-thumbnail hentry movie_genre-anime">
                <div class="gen-carousel-movies-style-2 movie-grid style-2">
                    <div class="gen-movie-contain">
                        <div class="gen-movie-img position-relative">
                         <img src="${image}" alt="Movie Thumbnail" class="img-fluid">
                            <div class="gen-movie-action">
                                <a href="/episodes/single-episode.html?i=${i}&t=${t}&s=${season.id}" class="gen-button">
                                    <i class="fa fa-play"></i>
                                </a>
                            </div>
                        </div>
                        <div class="gen-info-contain">
                            <h6><a href="#">${season.name}</a></h3>
                        </div>
                    </div>
                </div>
            </div>
       
        </div>
    `;
    }));

    return seasonItems.join('');
}

async function loadEpisodes(anime) {
    const episodesResponse = await fetch(`${baseUrl}/season/${s}/episodes`);
    if (!episodesResponse.ok) throw new Error('Erro ao buscar episódios');

    const episodesData = await episodesResponse.json();

    console.log(episodesData)
    return `
        <div class="tab-pane active show">
            <div class="episode-list">
                ${episodesData.data.map(episode => `
                    <div class="episode-item">
                        <a href="single-episode.html?i=${i}&t=${t}&s=${s}&ep=${episode.id}">
                            <div class="gen-movie-img">
                                <img src="${anime.poster}" alt="${anime.name}" class="img-fluid">
                                <span class="episode-number">${episode.episode_number}</span>
                            </div>
                        </a>
                    </div>
                `).join('')}
            </div>
        </div>`;
}

async function loadServers(data) {
    try {
        if (!data) {
            return `<div class="error-message">Selecione um episódio, em baixo primeiro!</div>`;
        }

        return `
            ${data.map(server => `
                <div class="col">
                    <button class="gen-button2" data-id="${server.id}" onclick="window.open('${server.url}', '_blank')">
                        ${server.name} (${server.lang} ${server.type})
                    </button>
                </div>
            `).join('')}`;
    } catch (error) {
        console.error("Erro ao carregar os servidores:", error);
        return `<div class="error-message">Erro ao carregar os servidores</div>`;
    }
}


function displayError(message) {
    hideLoading()
    const errorContainer = document.getElementById('error-container');
    const errorText = errorContainer.querySelector('.error-text');
    const closeButton = errorContainer.querySelector('.close-button');

    // Define o texto da mensagem de erro
    errorText.textContent = message;

    // Exibe o container de erro
    errorContainer.style.display = 'block';

    // Fecha automaticamente após 4 segundos (4000 ms)
    setTimeout(function () {
        errorContainer.style.display = 'none';
    }, 4000);

    // Adiciona evento de clique ao botão de fechar
    closeButton.addEventListener('click', function () {
        errorContainer.style.display = 'none'; // Esconde o container de erro quando clicado
    });
}

async function watchAnime() {
    showLoading()
    const token = localStorage.getItem('token');

    // Verifica se o token existe
    if (!token) {
        displayError('Você precisa estar logado para assistir ao anime.');
        return; // Para a execução se não houver token
    }

    try {
        const response = await fetch(`${baseUrl}/player/episode?id=${epNumber}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        // Converte a resposta para JSON
        const data = await response.json();

        // Verifica se a resposta da API foi ok
        if (data.code !== 0) {


            // Chama a função displayError se a requisição falhar
            displayError(data.message);
            return; // Para a execução se a resposta não for ok
        }

        watchMovieButton.style.display = 'none';
        watchMovie.style.display = 'none';

        document.getElementById('serverbs').innerHTML = await loadServers(data.data);

        paymentModal.style.display = 'block'
        // console.log(data);
        // const animeLink = data.media_Url;

        // // Redireciona o usuário para o proxy que adiciona os headers
        // window.open(`https://app.muffinstv.wuaze.com/muffins/v1/proxy-anime?url=${encodeURIComponent(animeLink)}`, '_blank');

        // window.open(`https://app.muffinstv.wuaze.com/muffins/v1/proxy-anime?url=${encodeURIComponent(animeLink)}`, '_blank');

    } catch (error) {
        console.error('Erro ao assistir anime:', error);

        // Se o erro tiver um status específico (por exemplo, se você receber um erro de rede),
        // você pode querer exibir uma mensagem mais específica.
        if (error instanceof TypeError) {
            displayError('Ocorreu um erro de rede. Verifique sua conexão e tente novamente.');
        } else if (error.message) {
            // Se o erro tiver uma mensagem, exiba-a
            displayError(`Erro: ${error.message}`);
        } else {
            // Mensagem padrão se não houver mensagem específica
            displayError('Ocorreu um erro ao tentar assistir ao anime. Tente novamente mais tarde.');
        }
    } finally {
        hideLoading(); // Garante que o loading será escondido
    }
}

async function updateCarousel(seasonsHtml) {
    updateDOM("#Season", seasonsHtml, {
        loop: true,
        dots: false,
        nav: true,
        autoplay: true,
        autoplayTimeout: 6000,
        margin: 30,
        responsive: {
            0: { items: 1, nav: true },
            576: { items: 2, nav: false },
            768: { items: 3, nav: true, loop: true },
            992: { items: 4, nav: true, loop: true },
            1200: { items: 5, nav: true, loop: true }
        }
    });
}

function updateDOM(elementId, htmlContent, carouselOptions) {
    const element = document.querySelector(elementId);
    if (element) {
        element.innerHTML = htmlContent;
        initializeCarousel(elementId, carouselOptions);
    } else {
        console.warn(`Elemento com o seletor ${elementId} não encontrado.`);
    }
}

async function initializeCarousel(carouselClass, options) {
    const carousels = document.querySelectorAll(carouselClass);
    carousels.forEach(carousel => {
        if ($(carousel).hasClass('owl-loaded')) {
            $(carousel).trigger('destroy.owl.carousel');
            $(carousel).removeClass('owl-loaded');
        }
        $(carousel).owlCarousel(options);
    });
}

function setupVideoPlayer() {
    const moviePlayer = document.getElementById('movie-player');
    const watchMovieButton = document.getElementById('watch-movie-btn');
    const watchMovie = document.getElementById("playBut");
    const videoHolder = document.getElementById('gen-video-holder');

    moviePlayer.style.background = 'rgba(0, 0, 0, 0.5)';

    const playMovie = () => {
        if (moviePlayer && videoHolder) setupPlayer();
    };

    const chooseServer = () => {
        watchMovieButton.style.display = 'none';
        watchMovie.style.display = 'none';
        loadServers(epNumber);
        paymentModal.style.display = 'block';
    };

    if (watchMovieButton) {
        watchMovieButton.addEventListener('click', watchAnime);
    }

    if (watchMovie) {
        watchMovie.addEventListener('click', watchAnime);
    }

    async function setupPlayer() {
        const player = videojs(moviePlayer);

        try {
            const response = await fetch(`${baseUrl}/anime/watch/${serverId}`);
            if (!response.ok) throw new Error('Falha ao buscar a URL da mídia');
            const mediaUrl = await response.json();

            const sourceType = mediaUrl.includes('.m3u8') ? 'application/x-mpegURL' :
                mediaUrl.includes('.mpd') ? 'application/dash+xml' :
                    'video/mp4';

            player.src({ src: mediaUrl, type: sourceType });

            watchMovie.style.display = 'none';
            moviePlayer.style.display = 'block';
            videoHolder.style.backgroundImage = 'none';
            watchMovieButton.style.display = 'none';

            player.ready(() => player.play());
        } catch (error) {
            console.error('Erro ao configurar o player:', error);
        }
    }
}

// Evento de clique no botão "Assistir Filme"
const watchMovieButton = document.getElementById('watch-movie-btn');
const watchMovie = document.getElementById("playBut");
// Evento de clique no botão de fechar
closeModal.addEventListener('click', () => {
    paymentModal.style.display = 'none'; // Fecha o modal
    watchMovie.style.display = 'inline-block'
    watchMovieButton.style.display = 'inline-block'
});

// Fecha o modal se o usuário clicar fora do conteúdo do modal
window.addEventListener('click', (event) => {

    if (event.target === paymentModal) {
        watchMovie.style.display = 'inline-block'
        watchMovieButton.style.display = 'inline-block'
        paymentModal.style.display = 'none'; // Fecha o modal
    }
});