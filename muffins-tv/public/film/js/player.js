// Função para obter o parâmetro 'id' da URL
function getIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("i");
}
function getTFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("t");
}
const paymentModal = document.getElementById("paymentModal");
const closeModal = document.getElementById("closeModal");

// URL base da API para obter os detalhes do filme
const baseApiUrl = " https://app.muffinstv.com/muffins/v1/";
const i = getIdFromURL();
const t = getTFromURL();
// Função para buscar os detalhes do filme da API
async function fetchMovieDetails(id) {
  showLoading(); // Exibe o loader antes da requisição
  try {
    const response = await fetch(`${baseApiUrl}post/${t}/${id}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar dados do filme");
    }

    const result = await response.json();

    // Validações de erro na resposta da API
    if (result.code !== 0) {
      displayError(result.message);
      throw new Error(result.message || "Erro ao buscar o filme");
    }

    // Verifica se os dados retornados são válidos e se há itens no array
    if (!result.data || result.data.length === 0) {
      const message = "Nenhum dado de filme disponível";
      displayError(message);
      throw new Error(message);
    }

    // Acessa o primeiro item do array
    const movieData = result.data;

    return movieData;
  } catch (error) {
    displayError(error || "Erro ao buscar o filme");
    console.error("Erro ao buscar o filme:", error);
    return null;
  } finally {
    hideLoading(); // Oculta o loader após a requisição, seja sucesso ou erro
  }
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

async function fetchContentDetails(id) {
  showLoading(); // Exibe o loader antes da requisição
  const token = localStorage.getItem("token");

  if (!token) {
    displayError(
      "Token de autenticação não encontrado. Por favor, faça login."
    );
    console.warn("Tentativa de requisição sem token. Requer login do usuário.");
    return null;
  }

  try {
    const response = await fetch(`${baseApiUrl}/player/${t}?id=${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // if (!response.ok) {
    //     // Lida com qualquer erro relacionado ao status HTTP
    //     const errorMessage = `Erro HTTP: ${response.status}`;
    //     handleError(`Erro ao buscar detalhes do filme. Status: ${response.status}`, errorMessage, response.status, id, token);
    //     return null;
    // }

    const result = await response.json();

    // Validações de erro na resposta da API
    if (result.code !== 0) {
      const message = result.message || "Erro ao buscar o conteúdo";
      handleError(
        message,
        "Erro no código de resposta da API",
        result.code,
        id,
        token
      );
      return null;
    }

    // Verifica se os dados retornados são válidos e se há itens no array
    if (!result.data || result.data.length === 0) {
      const message =
        result.message ||
        "Conteúdo de filme indisponível, por favor, assista a outros";
      handleError(message, "Mídia indisponível", result.code, id, token);
      return null;
    }

    // Acessa o primeiro item da lista
    const movieData = result.data;

    return movieData;
  } catch (error) {
    // Captura e loga erros de rede ou execução
    displayError("Erro ao buscar o conteúdo. Tente novamente mais tarde.");
    console.error({
      message: "Erro ao buscar o conteúdo.",
      error: error.message,
      stack: error.stack,
    });
    return null;
  } finally {
    hideLoading(); // Oculta o loader após a requisição, seja sucesso ou erro
  }
}

// Função de ajuda para exibir e logar erros
function handleError(userMessage, logMessage, statusOrCode, id, token) {
  displayError(userMessage);
  console.warn({
    message: logMessage,
    statusOrCode: statusOrCode,
    url: `${baseApiUrl}post/${t}/${i}`,
    token: token.slice(0, 10) + "...", // Mostrar parte do token para segurança
  });
}

function displayError(message) {
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
async function updateCarousel(seasonsHtml, id) {
  updateDOM(id, seasonsHtml, {
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
function updateDOM(elementId, htmlContent, carouselOptions) {
  const element = document.querySelector(elementId);
  if (element) {
    element.innerHTML = htmlContent;
    initializeCarousel(elementId, carouselOptions);
  } else {
    console.warn(`Elemento com o seletor ${elementId} não encontrado.`);
  }
}
// Função para exibir os detalhes do filme no HTML
function displayFilmDetails(film) {
  if (!film) {
    alert("Não foi possível carregar os detalhes do filme.");
    return;
  }

  const titleElement = document.querySelector(".gen-title");
  const descriptionElement = document.querySelector(".gen-description");
  const ratingElement = document.querySelector(".gen-sen-rating");
  const viewsElement = document.querySelector(
    ".gen-single-meta-holder .fas.fa-eye + span"
  );
  const languageElement = document.querySelector("#film-language");
  const subtitlesElement = document.querySelector("#film-subtitles");
  const durationElement = document.querySelector("#film-duration");
  const yearElement = document.querySelector("#film-year");
  const qualityElement = document.querySelector("#film-quality");
  const actorsElement = document.querySelector("#film-actors");
  const genreElement = document.querySelector("#film-genre");
  const btPlay = document.querySelector(".vjs-icon-placeholder");

  if (titleElement)
    titleElement.textContent = film.name || "Título não disponível";
  if (descriptionElement)
    descriptionElement.textContent =
      film.description || "Descrição não disponível";
  if (ratingElement) ratingElement.textContent = film.rating.rating || "N/A";
  if (viewsElement) viewsElement.textContent = `${film.total_views || 0} Views`;
  if (yearElement) yearElement.textContent = film.year || "N/A";
  if (qualityElement) qualityElement.textContent = film.lang || "N/A";
  if (genreElement)
    genreElement.textContent =
      film.genres?.map((category) => category.name).join(", ") || "N/A";

  const videoHolder = document.getElementById("gen-video-holder");
  const background = film.backdrop || film.poster;

  if (videoHolder) {
    videoHolder.style.backgroundImage = `url('${background}')`;
  }
}
function truncateText(text, limit) {
  return text.length > limit ? `${text.substring(0, limit)}...` : text;
}

function showLoading() {
  document.querySelector(".loader-container").style.display = "flex";
}

function hideLoading() {
  document.querySelector(".loader-container").style.display = "none";
}
async function loadServers(data, isDownload = false) {
  try {
    if (!data) {
      return `<div class="error-message">Selecione um episódio, em baixo primeiro!</div>`;
    }

    return `
    ${data
      .map(
        (server) => `
          <div class="col">
            <button 
              class="gen-button2" 
              data-id="${server.id}" 
              onclick="${
                isDownload
                  ? `handleServerClick('${server.url}', '${server.type}', true)`
                  : `handleServerClick('${server.url}', '${server.type}')`
              }">
              ${server.name} (${server.lang} ${server.type})
            </button>
          </div>
        `
      )
      .join("")}
    `;
  } catch (error) {
    console.error("Erro ao carregar os servidores:", error);
    return `<div class="error-message">Erro ao carregar os servidores</div>`;
  }
}
const moviePlayer = document.getElementById("movie-player");
const downloadContentButton = document.getElementById("download-movie-btn");

const videoHolder = document.getElementById("gen-video-holder");
function setupVideoPlayer(film) {
  moviePlayer.style.background = "rgba(0, 0, 0, 0.5)";
  const token = localStorage.getItem("token");

  async function setupPlayer(isDownload = false) {
    const content = await fetchContentDetails(i);

    watchMovie.style.display = "none";
    watchMovieButton.style.display = "none";
    downloadContentButton.style.display = "none";

    document.getElementById("serverbs").innerHTML = await loadServers(
      content,
      isDownload
    );

    paymentModal.style.display = "block";
    // downloadContentButton.style.display = 'none';

    //     if (mediaUrl && downloadContentButton) {
    //         downloadContentButton.style.display = 'inline-block'; // Exibe o botão de download
    //         downloadContentButton.addEventListener('click', function () {
    //             // Inicia o download usando a solução Blob
    //             fetch(mediaUrl)
    //                 .then(response => {
    //                     if (!response.ok) throw new Error('Erro ao baixar o vídeo');
    //                     return response.blob(); // Converte a resposta em um Blob
    //                 })
    //                 .then(blob => {
    //                     const url = URL.createObjectURL(blob); // Cria um URL para o Blob
    //                     const a = document.createElement('a'); // Cria um elemento <a>
    //                     a.href = url; // Define o href para o URL do Blob
    //                     a.download = film.title + '.mp4'; // Define o nome do arquivo para download
    //                     document.body.appendChild(a); // Adiciona o elemento ao DOM
    //                     a.click(); // Simula o clique no link
    //                     a.remove(); // Remove o elemento <a> do DOM
    //                     URL.revokeObjectURL(url); // Libera a memória do Blob
    //                 })
    //                 .catch(error => {
    //                     displayError(error.message);
    //                 });
    //         });
    //     }
    //  else {
    //         downloadContentButton.style.display = 'none'; // Esconde o botão de download se não houver URL
    //     }

    //     player.ready(function () {
    //         player.play();
    //     });
  }
  async function setupDownload() {
    const content = await fetchContentDetails(i);

    watchMovie.style.display = "none";
    watchMovieButton.style.display = "none";

    downloadContentButton.style.display - "none";

    document.getElementById("serverbs").innerHTML = await loadServers(
      content,
      true
    );

    paymentModal.style.display = "block";
    // downloadContentButton.style.display = 'none';

    //     if (mediaUrl && downloadContentButton) {
    //         downloadContentButton.style.display = 'inline-block'; // Exibe o botão de download
    //         downloadContentButton.addEventListener('click', function () {
    //             // Inicia o download usando a solução Blob
    //             fetch(mediaUrl)
    //                 .then(response => {
    //                     if (!response.ok) throw new Error('Erro ao baixar o vídeo');
    //                     return response.blob(); // Converte a resposta em um Blob
    //                 })
    //                 .then(blob => {
    //                     const url = URL.createObjectURL(blob); // Cria um URL para o Blob
    //                     const a = document.createElement('a'); // Cria um elemento <a>
    //                     a.href = url; // Define o href para o URL do Blob
    //                     a.download = film.title + '.mp4'; // Define o nome do arquivo para download
    //                     document.body.appendChild(a); // Adiciona o elemento ao DOM
    //                     a.click(); // Simula o clique no link
    //                     a.remove(); // Remove o elemento <a> do DOM
    //                     URL.revokeObjectURL(url); // Libera a memória do Blob
    //                 })
    //                 .catch(error => {
    //                     displayError(error.message);
    //                 });
    //         });
    //     }
    //  else {
    //         downloadContentButton.style.display = 'none'; // Esconde o botão de download se não houver URL
    //     }

    //     player.ready(function () {
    //         player.play();
    //     });
  }

  if (watchMovieButton) {
    watchMovieButton.addEventListener("click", function () {
      if (moviePlayer && videoHolder) {
        if (token) {
          setupPlayer();
        } else {
          window.location.href = "/log-in.html";
        }
      }
    });
  }
  if (watchMovie) {
    watchMovie.addEventListener("click", function () {
      if (moviePlayer && videoHolder) {
        if (token) {
          setupPlayer();
        } else {
          window.location.href = "/log-in.html";
        }
      }
    });
  }
  if (downloadContentButton) {
    downloadContentButton.addEventListener("click", function () {
      if (token) {
        setupPlayer(true);
      } else {
        window.location.href = "/log-in.html";
      }
    });
  }

  //   if (watchTrailerButton) {
  //     watchTrailerButton.addEventListener("click", function () {
  //       const title = film.title;
  //       if (title) {
  //         const searchQuery = encodeURIComponent(`${title} trailer`);
  //         const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;

  //         window.open(youtubeSearchUrl, "_blank");
  //       } else {
  //         alert("Título do filme não disponível para pesquisa.");
  //       }
  //     });
  //   }
}

function handleServerClick(url, type, isDownload = false) {
  try {
    // Decodifica a URL para garantir que ela esteja correta
    const decodedUrl = decodeURIComponent(url);
    console.log("Abrindo URL decodificada:", decodedUrl); // Log para verificar a URL decodificada

    if (type !== "EMBED" && isDownload) {
      // Faz o download do arquivo
      const link = document.createElement("a");
      link.href = decodedUrl;
      link.download = "movie"; // Você precisa especificar o nome do arquivo
      link.click();
    } else if (type === "EMBED") {
      // Verifique se a URL é válida antes de tentar abrir
      if (decodedUrl && decodedUrl.startsWith("http")) {
        // Tenta abrir a URL em uma nova aba
        const newTab = window.open(decodedUrl, "_blank");
        if (!newTab) {
          console.error(
            "Não foi possível abrir a nova aba. O navegador pode ter bloqueado."
          );
        }
      } else {
        console.error("URL inválida:", decodedUrl);
      }
    } else {
      // Caso contrário, chama a função setupPlayer
      setupPlayer(decodedUrl);
    }
  } catch (error) {
    console.error("Erro ao tentar abrir a URL:", error);
  }
}

function setupPlayer(url) {
  // Inicializa o Video.js player, se ainda não estiver inicializado
  const player = videojs(moviePlayer);

  // Seleciona o elemento da logo

  // Verifica a URL e o tipo de mídia
  const mediaUrl = url;
  const sourceType = mediaUrl.includes(".txt")
    ? "application/x-mpegURL"
    : mediaUrl.includes(".mpd")
    ? "application/dash+xml"
    : "video/mp4";

  // Atualiza a fonte do player com a URL e tipo de mídia
  player.src({ src: mediaUrl, type: sourceType });

  // Exibe o player de vídeo
  watchMovie.style.display = "none";
  moviePlayer.style.display = "block"; // Torna o player visível
  videoHolder.style.backgroundImage = "none"; // Remove o plano de fundo
  paymentModal.style.display = "none";
  watchMovieButton.style.display = "none"; // Esconde os botões de assistir ao filme e trailer

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
    // Define o tamanho da imagem
  });

  // Força a reprodução
  player.ready(() => {
    player.play();
  });
}

// Evento de clique no botão "Assistir Filme"
const watchMovieButton = document.getElementById("watch-movie-btn");
const watchMovie = document.getElementById("playBut");

closeModal.addEventListener("click", () => {
  paymentModal.style.display = "none"; // Fecha o modal
  watchMovie.style.display = "inline-block";
  watchMovieButton.style.display = "inline-block";
  downloadContentButton.style.display = "inline-block";
});

// Fecha o modal se o usuário clicar fora do conteúdo do modal
window.addEventListener("click", (event) => {
  if (event.target === paymentModal) {
    watchMovie.style.display = "inline-block";
    watchMovieButton.style.display = "inline-block";
    paymentModal.style.display = "none"; // Fecha o modal
    downloadContentButton.style.display = "inline-block";
  }
});
// Inicialização ao carregar o DOM
document.addEventListener("DOMContentLoaded", async function () {
  showLoading();
  const film = await fetchMovieDetails(i);
  updateCarousel(
    await createRecommendationsItems(film.recommendations.items),
    "#Recommendations"
  );
  displayFilmDetails(film);

  setupVideoPlayer(film);
});
