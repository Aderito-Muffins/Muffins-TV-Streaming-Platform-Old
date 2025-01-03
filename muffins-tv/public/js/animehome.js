function showLoading() {
  document.querySelector(".loader-container").style.display = "flex";
}
function hideLoading() {
  document.querySelector(".loader-container").style.display = "none";
}

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

// Função para limitar o tamanho do texto
function truncateText(text, limit) {
  return text.length > limit ? `${text.substring(0, limit)}...` : text;
}

// Função para criar o HTML dos itens do carrossel

function createCarouselItems(posts) {
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

// Função para exibir o conteúdo de cada seção
async function loadHomeContent() {
  showLoading();

  try {
    const response = await fetch(
      `https://app.muffinstv.wuaze.com/muffins/v1/anime/home?sessionId=${sessionId}`
    );

    const data = await response.json();
    const contentContainer = document.querySelector(".content-container");

    if (data.code === 0) {
      const { featured, sections } = data.data;

      // Adicionar o "featured" principal
      contentContainer.innerHTML += `
            <section class="pt-0 pb-0">
            <div class="container-fluid px-0">
               <div class="row no-gutters">
                  <div class="col-12">
                     <div class="gen-banner-movies banner-style-2">
                        <div id="movie-carousel" class="owl-carousel owl-loaded owl-drag" ></div>
                        <div class="item" style="background: url('${
                          featured.poster
                        }'); background-size: cover; background-position: center;">
                        <div class="gen-movie-contain-style-2 h-100">
                            <div class="container h-100">
                                <div class="row flex-row-reverse align-items-center h-100">
                                    <div class="col-xl-6">
                                        <div class="gen-front-anime-image">
                                            <img src="${
                                              featured.poster
                                            }" alt="imagem-banner-carrossel">
                                            ${
                                              featured.has_trailer
                                                ? `
                                            <a href="/single-movie.html?id=${featured.id}" class="playBut popup-youtube popup-vimeo popup-gmaps">
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
                                        <div class="gen-tag-line"><span>${
                                          featured.is_favorite
                                            ? "Mais Visto"
                                            : "Em Alta"
                                        }</span></div>
                                        <div class="gen-movie-info">
                                            <h3>${featured.title}</h3>
                                        </div>
                                        <div class="gen-movie-meta-holder">
                                            <ul class="gen-meta-after-title">
                                                <li class="gen-sen-rating"><span>${
                                                  featured.age
                                                }</span></li>
                                                <li class="gen-pulished-year"><span>Premiado: ${
                                                  featured.premiered
                                                }<span></li>
                                                <li class="gen-rating"><span> ${
                                                  featured.rating || "N/A"
                                                }</span></li>
                                            </ul>
                                            <div class="gen-meta-info">
                                                <ul class="gen-meta-after-excerpt">
                                                    <li><strong>Gênero :</strong> ${
                                                      featured.genres
                                                    }</li>
                                                    <li><strong>Duracao :</strong> ${
                                                      featured.runtime
                                                    }</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="gen-movie-action">
                                            <div class="gen-btn-container">
                                                <a href="/single-movie.html?id=${
                                                  featured.id
                                                }" class="gen-button gen-button-dark">
                                                    <i aria-hidden="true" class="fas fa-play"></i><span class="text">Assistir Agora</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>
            `;

      // Iterar pelas seções e adicionar cada uma
      sections.forEach((section, index) => {
        contentContainer.innerHTML += `
                    <section class="gen-section-padding-2">
                        <div class="container">
                            <div class="row">
                                <div class="col-xl-6 col-lg-6 col-md-6">
                                    <h4 class="gen-heading-title">${
                                      section.name
                                    }</h4>
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
                                        <div class="owl-carousel owl-theme owl-anime-section" 
                                             data-dots="false" data-nav="true"
                                             data-desk_num="4" data-lap_num="3" 
                                             data-tab_num="2" data-mob_num="1" 
                                             data-mob_sm="1" data-autoplay="false" 
                                             data-loop="false" data-margin="30">
                                            ${createCarouselItems(
                                              section.posts
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                `;
      });

      initializeCarousel(".owl-anime-section", {
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
          1200: { items: 5, nav: true, loop: true },
        },
      });
    } else {
      console.error("Erro ao carregar dados da API.");
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
  } finally {
    hideLoading();
  }
}

// Executar ao carregar a página
document.addEventListener("DOMContentLoaded", loadHomeContent);
