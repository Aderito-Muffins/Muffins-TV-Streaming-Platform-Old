$(document).ready(function () {
    let offset = 0; // Variável para controlar o offset da paginação
    let limit = 13; // Número de filmes a serem carregados a cada requisição
    let page = 1;
    let sortBy = 'title';
    let sortOrder = 'desc';

    // Função para inicializar o Owl Carousel
    function initializeCarousel(carouselId, options) {
        const carousel = $(carouselId);
        if (carousel.hasClass('owl-loaded')) {
            carousel.trigger('destroy.owl.carousel');
            carousel.removeClass('owl-loaded');
            carousel.find('.owl-stage-outer').children().unwrap();
        }
        carousel.owlCarousel(options);
    }

    // Função para truncar texto baseado no limite de caracteres
    function truncateText(text, limit) {
        return text.length > limit ? text.substring(0, limit) + '...' : text;
    }

    // Função para criar o HTML do carrossel principal
    function createCarouselItems(movies) {
        return movies.map(movie => {
            const title = truncateText(movie.title, 50); // Limita o título a 50 caracteres
            const description = truncateText(movie.brief, 150); // Limita a descrição a 150 caracteres

            return `
                <div class="item" style="background: url('${movie.cover}'); background-size: cover; background-position: center;">
                    <div class="gen-movie-contain-style-2 h-100">
                        <div class="container h-100">
                            <div class="row flex-row-reverse align-items-center h-100">
                                <div class="col-xl-6">
                                    <div class="gen-front-image">
                                        <img src="${movie.cover}" alt="imagem-banner-carrossel">
                                        ${movie.has_trailer ? `
                                        <a href="/single-movie.html?id=${movie.externalId}" class="playBut popup-youtube popup-vimeo popup-gmaps">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="213.7px" height="213.7px" viewBox="0 0 213.7 213.7">
                                                <polygon class="triangle" fill="none" stroke-width="7" points="73.5,62.5 148.5,105.8 73.5,149.1"></polygon>
                                                <circle class="circle" fill="none" stroke-width="7" cx="106.8" cy="106.8" r="103.3"></circle>
                                            </svg>
                                            <span>Assistir Trailer</span>
                                        </a>
                                        ` : ''}
                                    </div>
                                </div>
                                <div class="col-xl-6">
                                    <div class="gen-tag-line"><span>${movie.is_favorite ? 'Mais Visto' : 'Em Alta'}</span></div>
                                    <div class="gen-movie-info">
                                        <h3>${title}</h3>
                                    </div>
                                    <div class="gen-movie-meta-holder">
                                        <ul class="gen-meta-after-title">
                                            <li class="gen-sen-rating"><span>${movie.age}</span></li>
                                            <li><img src="${movie.small_thumb_url}" alt="imagem-avaliação"><span>${movie.rating || 'N/A'}</span></li>
                                        </ul>
                                        <p>${description}</p>
                                        <div class="gen-meta-info">
                                            <ul class="gen-meta-after-excerpt">
                                                <li><strong>Elenco :</strong> ${movie.actors.map(a => a.title).join(', ')}</li>
                                                <li><strong>Gênero :</strong> ${movie.category.map(c => `<span><a href="#">${c.title}</a></span>`).join(', ')}</li>
                                                <li><strong>Lancamento :</strong> ${movie.published_year} </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="gen-movie-action">
                                        <div class="gen-btn-container">
                                            <a href="/single-movie.html?id=${movie.externalId}" class="gen-button gen-button-dark">
                                                <i aria-hidden="true" class="fas fa-play"></i><span class="text">Assistir Agora</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Função para criar o HTML do carrossel de "All Time Hits"
    function createAllTimeHitsItems(films) {
        return films.map(film => `
            <div class="item">
                <div class="movie type-movie status-publish has-post-thumbnail hentry movie_genre-${film.type.toLowerCase()}">
                    <div class="gen-carousel-movies-style-2 movie-grid style-2">
                        <div class="gen-movie-contain">
                            <div class="gen-movie-img">
                                <img src="${film.thumb}" alt="Movie Thumbnail">
                                <div class="gen-movie-add">
                                    <div class="wpulike wpulike-heart">
                                        <div class="wp_ulike_general_class wp_ulike_is_not_liked">
                                            <button type="button" class="wp_ulike_btn wp_ulike_put_image"></button>
                                        </div>
                                    </div>
                                    <ul class="menu bottomRight">
                                        <li class="share top">
                                            <i class="fa fa-share-alt"></i>
                                            <ul class="submenu">
                                                <li><a href="#" class="facebook"><i class="fab fa-facebook-f"></i></a></li>
                                                <li><a href="#" class="instagram"><i class="fab fa-instagram"></i></a></li>
                                                <li><a href="#" class="twitter"><i class="fab fa-twitter"></i></a></li>
                                            </ul>
                                        </li>
                                    </ul>
                                    <div class="movie-actions--link_add-to-playlist dropdown">
                                        <a class="dropdown-toggle" href="#" data-toggle="dropdown"><i class="fa fa-plus"></i></a>
                                        <div class="dropdown-menu mCustomScrollbar">
                                            <div class="mCustomScrollBox">
                                                <div class="mCSB_container">
                                                    <a class="login-link" href="register.html">Sign in to add this movie to a playlist.</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="gen-movie-action">
                                    <a href="#" class="gen-button">
                                        <i class="fa fa-play"></i>
                                    </a>
                                </div>
                            </div>
                            <div class="gen-info-contain">
                                <div class="gen-movie-info">
                                    <h3><a href="#">${film.title} (${film.title_original})</a></h3>
                                </div>
                                <div class="gen-movie-meta-holder">
                                    <ul>
                                        <li>${film.duration}</li>
                                        <li><a href="#"><span>${film.hd_mode}</span></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Função para buscar e carregar filmes de acordo com as rotas criadas
    function fetchAndLoadMovies(url, processData) {
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.data && data.data.films) {
                processData(data.data.films);
            } else {
                console.error('Formato de dados inesperado:', data);
            }
        })
        .catch(error => console.error('Erro ao buscar dados dos filmes:', error));
    }

    // Funções de Carregamento Específicas
    function loadRecentMovies() {
        fetchAndLoadMovies(`http://localhost:3000/muffins/v1/films/recent?limit=${limit}&page=${page}`, movies => {
            $('#movie-carousel').html(createCarouselItems(movies));
            initializeCarousel('#movie-carousel', {
                items: 1,
                dots: false,
                nav: true,
                autoplay: true,
                loop: true,
                margin: 0
            });
        });
    }

    function loadAllTimeHits() {
        fetchAndLoadMovies('http://localhost:3000/muffins/v1/films/featured?limit=10', films => {
            $('#all-time-hits-carousel').html(createAllTimeHitsItems(films));
            initializeCarousel('#all-time-hits-carousel', {
                items: 4,
                dots: false,
                nav: true,
                autoplay: false,
                loop: false,
                margin: 30
            });
        });
    }

    // Inicialização de Carregamento ao Carregar a Página
    loadRecentMovies();
    loadAllTimeHits();
});
