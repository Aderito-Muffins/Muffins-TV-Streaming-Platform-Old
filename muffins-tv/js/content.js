$(document).ready(function () {
    // Função para inicializar o Owl Carousel
    function initializeCarousel() {
        const carousel = $('#movie-carousel');
        // Destroi o carrossel existente antes de recriá-lo
        if (carousel.hasClass('owl-loaded')) {
            carousel.trigger('destroy.owl.carousel');
            carousel.removeClass('owl-loaded');
            carousel.find('.owl-stage-outer').children().unwrap();
        }

        // Inicializa o carrossel
        carousel.owlCarousel({
            items: 1,
            dots: false,
            nav: true,
            autoplay: true,
            loop: true,
            margin: 0
        });
    }

    // Função para criar o HTML do carrossel a partir dos dados
    function createCarouselItems(movies) {
        return movies.map(movie => `
            <div class="item" style="background: url('${movie.coverUrl}'); background-size: cover; background-position: center;">
                <div class="gen-movie-contain-style-2 h-100">
                    <div class="container h-100">
                        <div class="row flex-row-reverse align-items-center h-100">
                            <div class="col-xl-6">
                                <div class="gen-front-image">
                                    <img src="${movie.coverUrl}" alt="imagem-banner-carrossel">
                                    <a href="${movie.trailerUrl}" class="playBut popup-youtube popup-vimeo popup-gmaps">
                                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="213.7px" height="213.7px" viewBox="0 0 213.7 213.7" enable-background="new 0 0 213.7 213.7" xml:space="preserve">
                                            <polygon class="triangle" fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="73.5,62.5 148.5,105.8 73.5,149.1"></polygon>
                                            <circle class="circle" fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" cx="106.8" cy="106.8" r="103.3"></circle>
                                        </svg>
                                        <span>Assistir Trailer</span>
                                    </a>
                                </div>
                            </div>
                            <div class="col-xl-6">
                                <div class="gen-tag-line"><span>${movie.isMostViewed ? 'Mais Visto' : 'Em Alta'}</span></div>
                                <div class="gen-movie-info">
                                    <h3>${movie.title}</h3>
                                </div>
                                <div class="gen-movie-meta-holder">
                                    <ul class="gen-meta-after-title">
                                        <li class="gen-sen-rating"><span>${movie.ageRating}</span></li>
                                        <li><img src="${movie.ratingImageUrl}" alt="imagem-avaliação"><span>${movie.rating}</span></li>
                                    </ul>
                                    <p>${movie.description}</p>
                                    <div class="gen-meta-info">
                                        <ul class="gen-meta-after-excerpt">
                                            <li><strong>Elenco :</strong> ${movie.cast.join(', ')}</li>
                                            <li><strong>Gênero :</strong> ${movie.genre.map(g => `<span><a href="#">${g}</a></span>`).join(', ')}</li>
                                            <li><strong>Tag :</strong> ${movie.tags.map(t => `<span><a href="#">${t}</a></span>`).join(', ')}</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="gen-movie-action">
                                    <div class="gen-btn-container">
                                        <a href="${movie.playUrl}" class="gen-button gen-button-dark">
                                            <i aria-hidden="true" class="fas fa-play"></i><span class="text">Assistir Agora</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Função principal para buscar dados e inicializar o carrossel
    function loadMovies() {
        fetch('http://localhost:3000/muffins/v1/contents/list-all', {
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
            if (data && data.contents) {
                const movies = data.contents;
                const carousel = $('#movie-carousel');

                // Adiciona os itens ao carrossel
                carousel.html(createCarouselItems(movies));

                // Inicializa o carrossel
                initializeCarousel();
            } else {
                console.error('Formato de dados inesperado:', data);
            }
        })
        .catch(error => console.error('Erro ao buscar dados dos filmes:', error));
    }

    // Carrega os filmes ao carregar a página
    loadMovies();
});
