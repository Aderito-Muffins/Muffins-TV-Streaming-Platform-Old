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

  function initializeCarousel(carouselId, options) {
    const carousel = document.querySelector(carouselId);
    if (carousel) {
      if (carousel.classList.contains("owl-loaded")) {
        $(carousel).trigger("destroy.owl.carousel");
        carousel.classList.remove("owl-loaded");
        if (carousel.querySelector(".owl-stage-outer")) {
          carousel.querySelector(".owl-stage-outer").children[0].unwrap();
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
  function createSportItems(films) {
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
                            <img src="${film.image_url}" alt="Movie Thumbnail">
                          
                            <div class="gen-movie-action">
                                <a href="/sports-pagination.html?id=${film.id}" class="gen-button">
                                    <i class="fa fa-play"></i>
                                </a>
                            </div>
                        </div>
                        <div class="gen-info-contain">
                            <div class="gen-movie-info">
                                <h3><a href="#">${film.name}</a></h3>
                            </div>
                            <div class="gen-movie-meta-holder">
                                <ul>
                                    <li>Live</li>
                           
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
        0: { items: 4, nav: true },
        576: { items: 5, nav: false },
        768: { items: 5, nav: true, loop: true },
        992: { items: 5, nav: true, loop: true },
        1200: { items: 6, nav: true, loop: true },
      },
    });
  }

  function updateSportCarousel(movies) {
    const sportItems = createSportItems(movies);
    updateDOM("#league-carossel", sportItems, {
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
  }

  async function loadTv() {
    const url = `https://app.muffinstv.com/muffins/v1/tv/list/category/Esportes?limit=${limit}&page=${page}&offset=${offset}`;
    loadMovies(url, updateTvCarousel);
  }

  async function loadSportCategory() {
    const url = `https://app.muffinstv.com/muffins/v1/sports/category/list?limit=${limit}&page=${page}&offset=${offset}`;
    loadMovies(url, updateSportCarousel);
  }
  loadSportCategory();
  loadTv();
  hideLoading();
});
