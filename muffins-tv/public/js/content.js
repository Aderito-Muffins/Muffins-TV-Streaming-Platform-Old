function showLoading() {
  document.querySelector(".loader-container").style.display = "flex"; // Exibe o loader
}

function hideLoading() {
  document.querySelector(".loader-container").style.display = "none"; // Oculta o loader
}

document.addEventListener("DOMContentLoaded", async function () {
  let offset = 0;
  let limit = 13;
  let page = 1;
  showLoading();

  // Inicializar o carrossel para cada seção
  function initializeCarousel(carouselClass, options) {
    const carousels = document.querySelectorAll(carouselClass);
    carousels.forEach((carousel) => {
      // Verificar se o carrossel já foi carregado para evitar conflitos
      if ($(carousel).hasClass("owl-loaded")) {
        $(carousel).trigger("destroy.owl.carousel"); // Destruir o carrossel existente
        $(carousel).removeClass("owl-loaded"); // Remover a classe 'loaded'
      }
      // Inicializar o carrossel com as opções fornecidas
      $(carousel).owlCarousel(options);
      console.log(`Carousel inicializado para o seletor ${carouselClass}`); // Log de verificação
    });
  }

  function truncateText(text, limit) {
    return text.length > limit ? `${text.substring(0, limit)}...` : text;
  }

  function createCarouselItems(movies) {
    if (!Array.isArray(movies)) {
      console.error("O objeto de filmes não é um array:", movies);
      return "";
    }
    return movies
      .map((movie) => {
        const title = truncateText(movie.name, 20);
        return `
                <div class="item" style="background: url('${
                  movie.backdrop
                }'); background-size: cover; background-position: center;">
                    <div class="gen-movie-contain-style-2 h-100">
                        <div class="container h-100">
                            <div class="row flex-row-reverse align-items-center h-100">
                                <div class="col-xl-6">
                                    <div class="gen-front-image">
                                        <img src="${
                                          movie.poster
                                        }" alt="imagem-banner-carrossel">
                                        ${
                                          movie.has_trailer
                                            ? `
                                        <a href="/${movie.type.slug}/single-movie.html?id=${movie.id}" class="playBut popup-youtube popup-vimeo popup-gmaps">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="213.7px" height="213.7px" viewBox="0 0 213.7 213.7">
                                                <polygon class="triangle" fill="none" stroke-width="7" points="73.5,62.5 148.5,105.8 73.5,149.1"></polygon>
                                                <circle class="circle" fill="none" stroke-width="7" cx="106.8" cy="106.8" r="103.3"></circle>
                                            </svg>
                                            <span>Assistir Trailer</span>
                                        </a>`
                                            : ""
                                        }
                                    </div>
                                </div>
                                <div class="col-xl-6">
                                    <div class="gen-tag-line">
                                        <span>${
                                          movie.is_favorite
                                            ? "Mais Visto"
                                            : "Em Alta"
                                        }</span>
                                    </div>
                                    <div class="gen-movie-info">
                                        <h3>${title}</h3>
                                    </div>
                                    <div class="gen-movie-meta-holder">
                                        <ul class="gen-meta-after-title">
                                            <li class="gen-sen-rating"><span>${
                                              movie.lang
                                            }</span></li>
                                            <li class="gen-pulished-year"><span>${
                                              movie.year
                                            }</span></li>
                                            <li class="gen-rating"><span>${
                                              movie.type.name || "N/A"
                                            }</span></li>
                                        </ul>
                                    </div>
                                    <div class="gen-movie-action">
                                        <div class="gen-btn-container">
                                     <a href="/${
                                       ["series", "animes", "dorama"].includes(
                                         movie.type.slug
                                       )
                                         ? "episodes"
                                         : "film"
                                     }/single-episode.html?i=${movie.id}&t=${
          movie.type.slug
        }" class="gen-button">
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
      })
      .join("");
  }

  function createMoviesHistory(films) {
    if (!Array.isArray(films)) {
      console.error("O objeto de filmes não é um array:", films);
      return "";
    }
    return films
      .map(
        (film) => `
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
                                <a href="/single-movie.html?id=${
                                  film.externalId
                                }" class="gen-button">
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
                                    <li>Assistido: ${new Date(
                                      film.watchedAt
                                    ).toLocaleDateString()}</li>
                                    <li><a href="#"><span>${
                                      film.hd_mode
                                    }</span></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
      )
      .join("");
  }

  function createAdBanner(films) {
    if (!Array.isArray(films)) {
      console.error("O objeto de filmes não é um array:", films);
      return "";
    }
    return films
      .map(
        (ad) => `
        <div class="item" style="background-image: url(${ad.imageUrl})">
        <div class="gen-movie-contain h-100">
            <div class="container h-100">
                <div class="row align-items-center h-100">
                    <div class="col-xl-6">
                        <div class="gen-movie-info">
                            <h3>${ad.title}</h3>
                        </div>
                        <div class="gen-movie-meta-holder">
                            <p>${ad.description}</p>
                        </div>
                        <div class="gen-movie-action">
                            <div class="gen-btn-container">
                                <a href="${ad.link}" class="gen-button gen-button-dark">
                                    <span class="text">VER MAIS</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
        `
      )
      .join("");
  }

  function createCarouselAnimes(posts) {
    const limitedPosts = posts.slice(0, 10);
    return limitedPosts
      .map(
        (post) => `
            <div class="item">
                <div class="movie type-movie status-publish has-post-thumbnail hentry ">
                    <div class="gen-carousel-movies-style-2 movie-grid style-2">
                        <div class="gen-movie-contain">
                            <div class="gen-movie-img position-relative">
                                <img src="${
                                  post.poster
                                }" alt="Movie Thumbnail" class="img-fluid">
                                ${
                                  post.age === "18+"
                                    ? `
                                    <div class="age-label position-absolute top-0 start-0 bg-danger text-white fw-bold p-1 rounded" style="margin: 10px;">
                                        +18
                                    </div>`
                                    : ""
                                }
                                <div class="gen-movie-add">
                                    <div class="wpulike wpulike-heart">
                                        <div class="wp_ulike_general_class wp_ulike_is_not_liked">
                                            <button type="button" class="wp_ulike_btn wp_ulike_put_image"></button>
                                        </div>
                                    </div>
                                </div>
                                <div class="gen-movie-action">
                                    <a href="/single-episode.html?animeId=${
                                      post.id
                                    }&title=${post.title}" class="gen-button">
                                        <i class="fa fa-play"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        `
      )
      .join("");
  }

  function createTvItems(films) {
    if (!Array.isArray(films)) {
      console.error("O objeto de filmes não é um array:", films);
      return "";
    }
    return films
      .map(
        (film) => `
        <div class="item">
            <div class="movie type-movie status-publish has-post-thumbnail hentry ">
                <div class="gen-carousel-movies-style-2 movie-grid style-2">
                    <div class="gen-movie-contain">
                        <div class="gen-tv-img">
                            <img src="${film.thumb}" alt="Movie Thumbnail">
                           
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
        `
      )
      .join("");
  }
  async function fetchAndProcessData(url) {
    try {
      // Configuração dos headers padrão
      let headers = {
        "Content-Type": "application/json",
      };

      // Verifica se a URL termina com "watched"

      const token = localStorage.getItem("token"); // Recupera o token do localStorage
      if (token) {
        // Adiciona o token no header Authorization
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Faz a requisição com os headers apropriados
      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });

      if (!response.ok) {
        throw new Error("Erro na requisição: " + response.statusText);
      }

      const data = await response.json();
      if (data && data.code === 0) {
        return data.data;
      } else {
        console.error(
          "Formato de dados inesperado ou dados não são um array:",
          data
        );
        return [];
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      return [];
    }
  }

  async function loadHomeContent(url, callback) {
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
  function createCarouselSectionsItem(posts) {
    // const limitedPosts = posts.slice(0, 10);
    return posts
      .map(
        (post) => `
            <div class="item">
                <div class="movie type-movie status-publish has-post-thumbnail hentry ">
                    <div class="gen-carousel-movies-style-2 movie-grid style-2">
                        <div class="gen-movie-contain">
                            <div class="gen-movie-img position-relative">
                                <img src="${
                                  post.poster
                                }" alt="Movie Thumbnail" class="img-fluid">
                                ${
                                  post.age === "18+"
                                    ? `
                                    <div class="age-label position-absolute top-0 start-0 bg-danger text-white fw-bold p-1 rounded" style="margin: 10px;">
                                        +18
                                    </div>`
                                    : ""
                                }
                            
                            <div class="gen-movie-action">
                                <a href="/${
                                  ["series", "animes", "dorama"].includes(
                                    post.type.slug
                                  )
                                    ? "episodes"
                                    : "film"
                                }/single-episode.html?i=${post.id}&t=${
          post.type.slug
        }" class="gen-button">
                                 <i class="fa fa-play"></i>
                                   </a>
                                </div>

                                        <div class="gen-info-contain">
                            <div class="gen-movie-info">
                                <h3><a href="#">${post.name}</a></h3>
                            </div>
                            <div class="gen-movie-meta-holder">
                                <ul>
                                    <li>${post.lang}</li>
                                    <li>${post.type.name}</li>
                                    <li>${post.year}</span></a></li>
                                </ul>
                            </div>
                        </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        `
      )
      .join("");
  }
  function createCarouselEpItem(posts) {
    // const limitedPosts = posts.slice(0, 10);
    return posts
      .map(
        (post) => `
            <div class="item">
                <div class="movie type-movie status-publish has-post-thumbnail hentry ">
                    <div class="gen-carousel-movies-style-2 movie-grid style-2">
                        <div class="gen-movie-contain">
                            <div class="gen-movie-img position-relative">
                                <img src="${
                                  post.backdrop
                                }" alt="Movie Thumbnail" class="img-fluid">
                                ${
                                  post.age === "18+"
                                    ? `
                                    <div class="age-label position-absolute top-0 start-0 bg-danger text-white fw-bold p-1 rounded" style="margin: 10px;">
                                        +18
                                    </div>`
                                    : ""
                                }
                                <div class="gen-movie-action">
                                    <a href="/episodes/single-episode.html?i=${
                                      post.post.id
                                    }&t=${post.post.type.slug}&s=${
          post.season.id
        }&ep=${post.id}" class="gen-button">
                                        <i class="fa fa-play"></i>
                                    </a>
                                </div>
                                        <div class="gen-info-contain">
                            <div class="gen-movie-info">
                                <h3><a href="#">${post.name} (${truncateText(
          post.post.name,
          10
        )})</a></h3>
                            </div>
                            <div class="gen-movie-meta-holder">
                                <ul>
                                    <li>${post.season.name}</li>
                                         <li>${post.post.lang}</span></a></li>
                                </ul>
                            </div>
                        </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        `
      )
      .join("");
  }

  function updateHomePage(content) {
    const contentContainer = document.querySelector(".content-container");
    console.log(content);
    const homeBanner = content.content.banners;
    const sections = content.content.sections;
    const episodes = content.content.episodes;

    // const watched = content.sections.watched.posts;
    const tvshows = content.sections.tvs.posts;
    const adsBanner = content.sections.ads.posts;
    const anime = content.sections.animes.posts;

    // Configuração padrão para os carrosséis responsivos
    const defaultResponsive = {
      0: { items: 4, nav: true },
      576: { items: 5, nav: false },
      768: { items: 5, nav: true, loop: true },
      992: { items: 5, nav: true, loop: true },
      1200: { items: 6, nav: true, loop: true },
    };

    contentContainer.innerHTML += `
                <section class="gen-section-padding-2">
                    <div class="container">
                        <div class="row">
                            <div class="col-xl-6 col-lg-6 col-md-6">
                                <h4 class="gen-heading-title">Novos Episodios</h4>
                            </div>
                            <div class="col-xl-6 col-lg-6 col-md-6 d-none d-md-inline-block">
                                <div class="gen-movie-action text-right">
                                    <a href="/categories.html" class="gen-button gen-button-flat">
                                        <span class="text">Ver Mais</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-12">
                                <div class="gen-style-2">
                                    <div class="owl-carousel owl-theme owl-episodes" 
                                         data-dots="false" data-nav="true"
                                         data-desk_num="4" data-lap_num="3" 
                                         data-tab_num="2" data-mob_num="1" 
                                         data-mob_sm="1" data-autoplay="false" 
                                         data-loop="false" data-margin="30">
                                        ${createCarouselEpItem(episodes)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            `;

    sections.forEach((section, index) => {
      contentContainer.innerHTML += `
                <section class="gen-section-padding-2">
                    <div class="container">
                        <div class="row">
                            <div class="col-xl-6 col-lg-6 col-md-6">
                                <h4 class="gen-heading-title">${
                                  section.title
                                }</h4>
                            </div>
                            <div class="col-xl-6 col-lg-6 col-md-6 d-none d-md-inline-block">
                                <div class="gen-movie-action text-right">
                                    <a href="/movies-pagination.html?genre=1" class="gen-button gen-button-flat">
                                        <span class="text">Ver Mais</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-12">
                                <div class="gen-style-2">
                                    <div class="owl-carousel owl-theme owl-anime-section" 
                                         data-dots="false" data-nav="true"
                                         data-desk_num="4" data-lap_num="3" 
                                         data-tab_num="2" data-mob_num="1" 
                                         data-mob_sm="1" data-autoplay="false" 
                                         data-loop="false" data-margin="30">
                                        ${createCarouselSectionsItem(
                                          section.items
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            `;

      // Inicialize o carrossel com a classe única
    });

    initializeCarousel(`.owl-episodes`, {
      loop: true,
      dots: false,
      nav: true,
      autoplay: true,
      autoplayTimeout: 6000,
      margin: 30,
      responsive: defaultResponsive,
    });

    initializeCarousel(".owl-anime-section", {
      loop: true,
      dots: false,
      nav: true,
      autoplay: true,
      autoplayTimeout: 6000,
      margin: 30,
      responsive: {
        0: { items: 4, nav: true },
        576: { items: 5, nav: false },
        768: { items: 5, nav: true, loop: true },
        992: { items: 5, nav: true, loop: true },
        1200: { items: 6, nav: true, loop: true },
      },
    });

    const tvItems = createTvItems(tvshows);
    updateDOM("#tv-carossel", tvItems, {
      loop: true,
      dots: false,
      nav: true,
      autoplay: true,
      autoplayTimeout: 6000,
      margin: 30,
      responsive: defaultResponsive,
    });

    const animeItem = createCarouselAnimes(anime);
    updateDOM("#animes-carrousel", animeItem, {
      loop: true,
      dots: false,
      nav: true,
      autoplay: true,
      autoplayTimeout: 6000,
      margin: 30,
      responsive: defaultResponsive,
    });

    // Atualização do banner principal (destaques)
    const carouselHtml = createCarouselItems(homeBanner);
    updateDOM("#movie-carousel", carouselHtml, {
      loop: true,
      dots: false,
      nav: true,
      autoplay: true,
      autoplayTimeout: 6000,
      margin: 30,
      items: 1,
      animateIn: "fadeIn",
      animateOut: "fadeOut",
    });

    // const allTimeHitsHtml = createMoviesHistory(watched);
    // updateDOM("#movieshistory-carousel", allTimeHitsHtml, {
    //     loop: true,
    //     dots: false,
    //     nav: true,
    //     autoplay: true,
    //     autoplayTimeout: 6000,
    //     margin: 30,
    //     responsive: defaultResponsive
    // });

    const adBanner = createAdBanner(adsBanner);
    updateDOM("#addPost", adBanner, {
      items: 1,
      dots: true,
      nav: false,
      autoplay: true,
      loop: true,
      margin: 30,
    });
  }

  async function loadHome() {
    try {
      const url = `https://muffinstvapi.onrender.com/muffins/v1/home`;
      await loadHomeContent(url, updateHomePage);
    } catch (error) {
      console.error("Erro ao carregar temporadas e episódios:", error);
    } finally {
      hideLoading(); // Garante que o loading será escondido
    }
  }

  loadHome();
});
