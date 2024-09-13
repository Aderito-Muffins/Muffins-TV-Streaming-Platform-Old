document.addEventListener("DOMContentLoaded", async function () {
    let offset = 0;
    let limit = 13;
    let page = 1;

    function initializeCarousel(carouselId, options) {
        const carousel = document.querySelector(carouselId);
        if (carousel) {
            if (carousel.classList.contains('owl-loaded')) {
                $(carousel).trigger('destroy.owl.carousel');
                carousel.classList.remove('owl-loaded');
                if (carousel.querySelector('.owl-stage-outer')) {
                    carousel.querySelector('.owl-stage-outer').children[0].unwrap();
                }
            }
            $(carousel).owlCarousel(options);
        } else {
            console.warn(`Elemento com o seletor ${carouselId} não encontrado.`);
        }
    }

    function truncateText(text, limit) {
        return text.length > limit ? `${text.substring(0, limit)}...` : text;
    }

    function createCarouselItems(movies) {
        if (!Array.isArray(movies)) {
            console.error('O objeto de filmes não é um array:', movies);
            return '';
        }
        return movies.map(movie => {
            const title = truncateText(movie.title, 50);
            const description = truncateText(movie.brief, 150);
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
                                    </a>` : ''}
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
                                         <li class="gen-pulished-year"><span> ${movie.published_year}<span></li>
                                         <li class="gen-rating"><span> ${movie.rating || 'N/A'}</span></li>
                
                                    </ul>
                                    <p>${description}</p>
                                    <div class="gen-meta-info">
                                        <ul class="gen-meta-after-excerpt">
                                            <li><strong>Elenco :</strong> ${movie.actors.map(a => a.title).join(', ')}</li>
                                            <li><strong>Gênero :</strong> ${movie.category.map(c => `<span><a href="#">${c.title}</a></span>`).join(', ')}</li>
                                         
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

    function createAllTimeHitsItems(films) {
        if (!Array.isArray(films)) {
            console.error('O objeto de filmes não é um array:', films);
            return '';
        }
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
                                <a href="/single-movie.html?id=${film.externalId}" class="gen-button">
                                    <i class="fa fa-play"></i>
                                </a>
                            </div>
                        </div>
                        <div class="gen-info-contain">
                            <div class="gen-movie-info">
                                <h3><a href="#">${film.title}</a></h3>
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

    function createTvItems(films) {
        if (!Array.isArray(films)) {
            console.error('O objeto de filmes não é um array:', films);
            return '';
        }
        return films.map(film => `
        <div class="item">
            <div class="movie type-movie status-publish has-post-thumbnail hentry ">
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
                                <a href="/single-tv.html?id=${film.id}&title=${film.title}" class="gen-button">
                                    <i class="fa fa-play"></i>
                                </a>
                            </div>
                        </div>
                        <div class="gen-info-contain">
                            <div class="gen-movie-info">
                                <h3><a href="#">${film.title}</a></h3>
                            </div>
                            <div class="gen-movie-meta-holder">
                                <ul>
                                    <li>Live</li>
                                    <li><a href="#"><span>auto</span></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `).join('');
    }
    async function fetchAndProcessData(url) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erro na requisição: ' + response.statusText);
            }

            const data = await response.json();
            if (data && data.code === 0) {
                return data.data;
            } else {
                console.error('Formato de dados inesperado ou dados não são um array:', data);
                return [];
            }
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            return [];
        }
    }
    

    async function loadMovies(url, callback) {
        const data = await fetchAndProcessData(url);
        if (data) callback(data);
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

    function updateCarousel(movies) {
        const allTimeHitsHtml = createAllTimeHitsItems(movies);
        updateDOM("#all-time-hits-carousel", allTimeHitsHtml, {
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

    function updateTvCarousel(movies) {
        const tvItems = createTvItems(movies);
        updateDOM("#tv-carossel", tvItems, {
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

    function updateBannerCarousel(data) {
        const carouselHtml = createCarouselItems(data);
        updateDOM("#movie-carousel", carouselHtml, {
            loop: true,
            dots: false,
            nav: true,
            autoplay: true,
            autoplayTimeout: 6000,
            margin: 30,
            items: 1,
            animateIn: 'fadeIn',
            animateOut: 'fadeOut'
        });
    }

    async function loadBannerMovies() {
        const bannerUrl = `https://muffins-tv-api-2f0282275534.herokuapp.com/muffins/v1/films/recent?limit=${limit}&page=${page}&offset=${offset}`;
        loadMovies(bannerUrl, updateBannerCarousel);
    }

    async function loadAllTimeHits() {
        const url = `https://muffins-tv-api-2f0282275534.herokuapp.com/muffins/v1/films/featured?limit=${limit}&page=${page}&offset=${offset}`;
        loadMovies(url, updateCarousel);
    }

    async function loadTv() {
        const url = `https://muffins-tv-api-2f0282275534.herokuapp.com/muffins/v1/tv/list?limit=${limit}&page=${page}&offset=${offset}`;
        loadMovies(url, updateTvCarousel);
    }

    loadBannerMovies();
    loadAllTimeHits();
    loadTv();
});
