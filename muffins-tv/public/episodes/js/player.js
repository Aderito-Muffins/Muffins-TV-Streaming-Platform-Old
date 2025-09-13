const baseUrl = " https://app.muffinstv.com/muffins/v1";
let StrangeUrl;
let serverId = "";
let epNumber = "";
let t = "";
let i = "";
let s = "";
let image;

function showLoading() {
  document.querySelector(".loader-container").style.display = "flex";
}

function hideLoading() {
  document.querySelector(".loader-container").style.display = "none";
}

const paymentModal = document.getElementById("paymentModal");
const closeModal = document.getElementById("closeModal");

document.addEventListener("DOMContentLoaded", loadSeasonsAndEpisodes);

async function loadSeasonsAndEpisodes() {
  showLoading();
  try {
    const urlParams = new URLSearchParams(window.location.search);
    i = urlParams.get("i");
    s = urlParams.get("s");
    t = urlParams.get("t");

    epNumber = urlParams.get("ep");

    if (!i) {
      throw new Error("animeId não encontrado na URL.");
    }

    const animeData = await fetchContentData(i);
    updateContentInfo(animeData);

    // StrangeUrl = ''
    // const activeAnimeId ="2"

    if (!s) {
      const [seasonsHtml, recommendHtml] = await Promise.all([
        createSeasonItems(animeData.data.seasons),
        createRecommendationsItems(animeData.data.recommendations.items),
      ]);
      updateCarousel(seasonsHtml, "#Season");
      updateCarousel(recommendHtml, "#Recommendations");
    } else {
      const [seasonsHtml, episodesHtml, recommendHtml] = await Promise.all([
        createSeasonItems(animeData.data.seasons),
        loadEpisodes(animeData.data),
        createRecommendationsItems(animeData.data.recommendations.items),
      ]);
      updateCarousel(seasonsHtml, "#Season");
      updateCarousel(recommendHtml, "#Recommendations");

      document.getElementById("eps").innerHTML = episodesHtml;
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
  if (response.code == 0) throw new Error("Erro ao buscar dados do anime");
  return response.json();
}

function truncateText(text, limit) {
  return text.length > limit ? `${text.substring(0, limit)}...` : text;
}
const doctitle = document.querySelector("#web-title");

function updateContentInfo(animeData) {
  console.log(animeData.data.backdrop);
  const title = animeData.data.name;
  const poster = animeData.data.backdrop;
  image = animeData.data.poster;
  const premiered = animeData.data.year;
  const views = animeData.data.total_views;
  const overview = animeData.data.description;
  const genres = animeData.data.genres.map((genre) => ` ${genre.name}`);
  const genresList = genres || "NULL";
  const lang = animeData.data.lang;
  const premieredValue = premiered || "NULL";
  const moviePlayer = document.getElementById("movie-player");
  moviePlayer.style.background = "rgba(0, 0, 0, 0.5)";

  const videoHolder = document.getElementById("gen-video-holder");
  if (videoHolder) {
    videoHolder.style.backgroundImage = `url(${poster})`;
  }

  if (doctitle)
    doctitle.textContent =
      "Assistir " + title + " na MUFFINS TV" || "MUFFINS TV";

  document.querySelector(".gen-single-tv-show-info").innerHTML += `
        <h2 class="gen-title">${title}</h2>
        <div class="gen-single-meta-holder">
            <ul>
                <li class="gen-sen-rating">Classificação: ${
                  animeData.data.rating.rating
                }</li>
                <li><i class="fas fa-eye"></i><span>${
                  views || 0
                } Views</span></li>
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
    console.error("O objeto de temporadas não é um array:", seasons);
    return "";
  }

  // Obtenha o parâmetro `s` da URL
  const urlParams = new URLSearchParams(window.location.search);
  const currentSeason = urlParams.get("s");

  const seasonItems = await Promise.all(
    seasons.map(async (season, index) => {
      const name = truncateText(season.name, 20);

      return `
        <div class="item ">
            <div class="movie type-movie status-publish has-post-thumbnail hentry movie_genre-anime">
                <div class="gen-carousel-movies-style-2 movie-grid style-2">
                    <div class="gen-movie-contain">
                        <div class="gen-movie-img ${
                          currentSeason == season.id ? "active" : ""
                        } position-relative">
                            <img src="${image}" alt="Movie Thumbnail" class="img-fluid">
                            <div class="gen-movie-action">
                                <a href="/episodes/single-episode.html?i=${i}&t=${t}&s=${
        season.id
      }" class="gen-button">
                                    <i class="fa fa-play"></i>
                                </a>
                            </div>
                        </div>
                        <div class="gen-info-contain">
                            <div class="gen-movie-info">
                                <h3><a href="#">${name}</a></h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    })
  );

  return seasonItems.join("");
}

async function createRecommendationsItems(seasons) {
  if (!Array.isArray(seasons)) {
    console.error("O objeto de temporadas não é um array:", seasons);
    return "";
  }

  const seasonItems = await Promise.all(
    seasons.map(async (post, index) => {
      const name = truncateText(post.name, 15);

      return `
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
                                <h3><a href="#">${name}</a></h3>
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
    `;
    })
  );

  return seasonItems.join("");
}

async function loadEpisodes(anime) {
  const episodesResponse = await fetch(`${baseUrl}/season/${s}/episodes`);
  if (!episodesResponse.ok) throw new Error("Erro ao buscar episódios");

  const episodesData = await episodesResponse.json();

  console.log(episodesData);

  // Obtenha o parâmetro `epNumber` da URL
  const urlParams = new URLSearchParams(window.location.search);
  const epNumber = urlParams.get("ep");

  return `
        <div class="tab-pane active show">
            <div class="episode-list">
                ${episodesData.data
                  .map(
                    (episode) => `
                    <div class="episode-item">
                        <a href="single-episode.html?i=${i}&t=${t}&s=${s}&ep=${
                      episode.id
                    }">
                            <div class="gen-movie-img ${
                              epNumber == episode.id ? "active" : ""
                            }">
                                <img src="${anime.poster}" alt="${
                      anime.name
                    }" class="img-fluid">
                                <span class="episode-number">${
                                  episode.episode_number
                                }</span>
                            </div>
                        </a>
                    </div>
                `
                  )
                  .join("")}
            </div>
        </div>`;
}

async function loadServers(data, isDownload = false) {
  try {
    if (!data) {
      return `<div class="error-message">Selecione um episódio, em baixo primeiro!</div>`;
    }
    const buttonTemplate = (server) => `
        <div class="col">
            <button 
                class="gen-button2" 
                data-id="${server.id}" 
                onclick="${
                  isDownload
                    ? `setupDownload('${server.url}')`
                    : `setupPlayer('${server.url}')`
                }">
                ${server.name} (${server.lang} ${server.type})
            </button>
        </div>
      `;
    if (!isDownload) {
      return data.map(buttonTemplate).join("");
    } else {
      return data.map(buttonTemplate);
    }
  } catch (error) {
    console.error("Erro ao carregar os servidores:", error);
    return `<div class="error-message">Erro ao carregar os servidores</div>`;
  }
}

function displayError(message) {
  hideLoading();
  const errorContainer = document.getElementById("error-container");
  const errorText = errorContainer.querySelector(".error-text");
  const closeButton = errorContainer.querySelector(".close-button");

  // Define o texto da mensagem de erro
  errorText.textContent = message;

  // Exibe o container de erro
  errorContainer.style.display = "block";

  // Fecha automaticamente após 4 segundos (4000 ms)
  setTimeout(function () {
    errorContainer.style.display = "none";
  }, 4000);

  // Adiciona evento de clique ao botão de fechar
  closeButton.addEventListener("click", function () {
    errorContainer.style.display = "none"; // Esconde o container de erro quando clicado
  });
}

async function watchAnime(isDownload = false) {
  showLoading();
  const token = localStorage.getItem("token");

  if (!token) {
    // Exibir mensagem de erro
    displayError("Você precisa estar logado para assistir ao anime.");
    console.warn("Tentativa de requisição sem token. Requer login do usuário.");

    // Redirecionar para a tela de login após 3 segundos
    setTimeout(() => {
      window.location.href = "/log-in.html"; // Substitua "/login" pela URL da tela de login
    }, 2000);

    return null;
  }

  if (!s || !epNumber) {
    displayError("Selecione uma temporada e um episodio abaixo.");
    return; // Para a execução se não houver token
  }

  try {
    const response = await fetch(`${baseUrl}/player/episode?id=${epNumber}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Converte a resposta para JSON
    const data = await response.json();

    // Verifica se a resposta da API foi ok
    if (data.code !== 0) {
      // Chama a função displayError se a requisição falhar
      displayError(data.message);
      // Redirecionar para a tela de login após 3 segundos
      if (
        data.message ===
        'Acesso negado. Para continuar, clique no botão "Assine" e escolha uma assinatura válida.'
      ) {
        setTimeout(() => {
          window.location.href = "/pricing.html"; // Substitua "/login" pela URL da tela de login
        }, 2000);
      }
      return; // Para a execução se a resposta não for ok
    }

    watchMovieButton.style.display = "none";
    watchMovie.style.display = "none";
    downloadButton.style.display = "none";
    moviePlayer.style.display = "block";
    videoHolder.style.display = "block";

    document.getElementById("serverbs").innerHTML = await loadServers(
      data.data,
      isDownload
    );

    paymentModal.style.display = "block";
    // console.log(data);
    // const animeLink = data.media_Url;

    // // Redireciona o usuário para o proxy que adiciona os headers
    // window.open(` https://app.muffinstv.com/muffins/v1/proxy-anime?url=${encodeURIComponent(animeLink)}`, '_blank');

    // window.open(` https://app.muffinstv.com/muffins/v1/proxy-anime?url=${encodeURIComponent(animeLink)}`, '_blank');
  } catch (error) {
    console.error("Erro ao assistir anime:", error);

    // Se o erro tiver um status específico (por exemplo, se você receber um erro de rede),
    // você pode querer exibir uma mensagem mais específica.
    if (error instanceof TypeError) {
      displayError(
        "Ocorreu um erro de rede. Verifique sua conexão e tente novamente."
      );
    } else if (error.message) {
      // Se o erro tiver uma mensagem, exiba-a
      displayError(`Erro: ${error.message}`);
    } else {
      // Mensagem padrão se não houver mensagem específica
      displayError(
        "Ocorreu um erro ao tentar assistir ao anime. Tente novamente mais tarde."
      );
    }
  } finally {
    hideLoading(); // Garante que o loading será escondido
  }
}

async function updateCarousel(seasonsHtml, id) {
  updateDOM(id, seasonsHtml, {
    loop: false,
    dots: false,
    nav: true,
    autoplay: true,
    autoplayTimeout: 6000,
    margin: 30,
    responsive: {
      0: { items: 4, nav: false },
      576: { items: 5, nav: false },
      768: { items: 5, nav: true, loop: false },
      992: { items: 5, nav: true, loop: false },
      1200: { items: 6, nav: true, loop: false },
    },
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
  carousels.forEach((carousel) => {
    if ($(carousel).hasClass("owl-loaded")) {
      $(carousel).trigger("destroy.owl.carousel");
      $(carousel).removeClass("owl-loaded");
    }
    $(carousel).owlCarousel(options);
  });
}
const moviePlayer = document.getElementById("movie-player");
const videoHolder = document.getElementById("gen-video-holder");

function setupVideoPlayer() {
  moviePlayer.style.background = "rgba(0, 0, 0, 0.5)";

  const playMovie = () => {
    if (moviePlayer && videoHolder) setupPlayer();
  };

  const chooseServer = () => {
    watchMovieButton.style.display = "none";
    watchMovie.style.display = "none";
    downloadButton.style.display = "none";
    loadServers(epNumber);
    paymentModal.style.display = "block";
  };
  if (downloadButton) {
    downloadButton.addEventListener("click", () => watchAnime(true));
  }
  if (watchMovieButton) {
    watchMovieButton.addEventListener("click", () => watchAnime());
  }
  if (watchMovie) {
    watchMovie.addEventListener("click", () => watchAnime());
  }
}
function setupPlayer(url) {
  // Inicializa o Video.js player, se ainda não estiver inicializado
  const player = videojs(moviePlayer);

  // Função para determinar o tipo de mídia com base na URL
  const determineSourceType = (mediaUrl) => {
    // Remove parâmetros da URL (query string) para analisar apenas o caminho principal
    const cleanUrl = mediaUrl.split("?")[0];

    if (/\.m3u8$/i.test(cleanUrl)) {
      return "application/x-mpegURL"; // HLS
    } else if (/\.mpd$/i.test(cleanUrl)) {
      return "application/dash+xml"; // MPEG-DASH
    } else if (/\.mp4$/i.test(cleanUrl)) {
      return "video/mp4"; // MP4
    } else if (/\.txt$/i.test(cleanUrl)) {
      // Possivelmente uma lista de reprodução; tratar como HLS por padrão
      return "application/x-mpegURL";
    } else {
      console.warn(
        "Tipo de arquivo não reconhecido. Assumindo MP4 como padrão."
      );
      return "application/x-mpegURL"; // Tipo padrão para arquivos desconhecidos
    }
  };

  // Determina o tipo da mídia
  const sourceType = determineSourceType(url);

  // Atualiza a fonte do player com a URL e tipo de mídia
  player.src({ src: url, type: sourceType });

  // Configura o layout do player
  watchMovie.style.display = "none";
  moviePlayer.style.display = "block"; // Torna o player visível
  videoHolder.style.backgroundImage = "none"; // Remove o plano de fundo
  paymentModal.style.display = "none";

  // Esconde os botões de assistir ao filme e trailer
  watchMovieButton.style.display = "none";
  downloadButton.style.display = "none";

  // Configura o plugin de watermark
  player.watermark({
    file: "/images/m.png",
    xpos: 5,
    ypos: 5,
    xrepeat: 0,
    opacity: 100,
    clickable: false,
    url: "",
    className: "vjs-watermark",
    text: false,
    debug: false,
  });

  // Força a reprodução quando o player estiver pronto
  player.ready(function () {
    try {
      player.play();
    } catch (error) {
      console.error("Erro ao iniciar reprodução:", error);
    }
  });
}

function setupDownload(url) {
  // Verifica a URL e o tipo de mídia
  const mediaUrl = url;

  // Extrai o nome do arquivo da URL
  const fileName = mediaUrl.split("/").pop();

  // Cria um elemento de link (<a>) para iniciar o download
  const downloadLink = document.createElement("a");
  downloadLink.href = mediaUrl;
  downloadLink.download = fileName; // Define o nome do arquivo de download

  // Dispara o evento de clique no elemento de link para iniciar o download
  downloadLink.click();
}

// Evento de clique no botão "Assistir Filme"
const watchMovieButton = document.getElementById("watch-movie-btn");
const watchMovie = document.getElementById("playBut");
const downloadButton = document.querySelector(".gen-icon");
// Evento de clique no botão de fechar
closeModal.addEventListener("click", () => {
  paymentModal.style.display = "none"; // Fecha o modal
  watchMovie.style.display = "inline-block";
  watchMovieButton.style.display = "inline-block";
  downloadButton.style.display = "inline-block";
});

// Fecha o modal se o usuário clicar fora do conteúdo do modal
window.addEventListener("click", (event) => {
  if (event.target === paymentModal) {
    watchMovie.style.display = "inline-block";
    watchMovieButton.style.display = "inline-block";
    paymentModal.style.display = "none"; // Fecha o modal
    downloadButton.style.display = "inline-block";
  }
});
