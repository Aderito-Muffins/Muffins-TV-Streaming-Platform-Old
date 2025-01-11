// Função para obter o parâmetro 'id' da URL
function getIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// URL base da API para obter os detalhes do filme
const baseApiUrl = "https://muffinstvapi.onrender.com/muffins/v1/";
const filmId = getIdFromURL();

// Função para buscar os detalhes do filme da API
async function fetchMovieDetails(id) {
  showLoading(); // Exibe o loader antes da requisição
  try {
    const response = await fetch(`${baseApiUrl}films/id/${id}`);
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
    const movieData = result.data[0];

    return movieData;
  } catch (error) {
    displayError(error || "Erro ao buscar o filme");
    console.error("Erro ao buscar o filme:", error);
    return null;
  } finally {
    hideLoading(); // Oculta o loader após a requisição, seja sucesso ou erro
  }
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
    const response = await fetch(`${baseApiUrl}films/external/${id}`, {
      method: "GET",
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
    const movieData = result.data[0];

    // Verifica se o primeiro item contém um media_url válido
    if (!movieData.media_url || movieData.media_url === "") {
      const message = "Mídia indisponível para o filme selecionado.";
      handleError(message, "Mídia indisponível", result.code, id, token);
      return null;
    }

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
    url: `${baseApiUrl}films/external/${id}`,
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
    titleElement.textContent = film.title || "Título não disponível";
  if (descriptionElement)
    descriptionElement.textContent = film.brief || "Descrição não disponível";
  if (ratingElement) ratingElement.textContent = film.age || "N/A";
  if (viewsElement) viewsElement.textContent = `${film.views || 0} Views`;
  if (languageElement) languageElement.textContent = film.nation || "N/A";
  if (subtitlesElement)
    subtitlesElement.textContent =
      film.sub_mode?.map((sub) => sub.title).join(", ") || "N/A";
  if (durationElement) durationElement.textContent = film.duration || "N/A";
  if (yearElement) yearElement.textContent = film.published_year || "N/A";
  if (qualityElement) qualityElement.textContent = film.hd_mode || "N/A";
  if (actorsElement)
    actorsElement.textContent =
      film.actors?.map((actor) => actor.title).join(", ") || "N/A";
  if (genreElement)
    genreElement.textContent =
      film.category?.map((category) => category.title).join(", ") || "N/A";

  const videoHolder = document.getElementById("gen-video-holder");
  if (videoHolder) {
    videoHolder.style.backgroundImage = `url('${film.cover}')`;
  }
}

function showLoading() {
  document.querySelector(".loader-container").style.display = "flex";
}

function hideLoading() {
  document.querySelector(".loader-container").style.display = "none";
}

function setupVideoPlayer(film) {
  const moviePlayer = document.getElementById("movie-player");
  const watchMovieButton = document.getElementById("watch-movie-btn");
  const downloadContentButton = document.getElementById("download-content-btn");
  const watchMovie = document.getElementById("playBut");
  const watchTrailerButton = document.getElementById("watch-trailer-btn");
  const videoHolder = document.getElementById("gen-video-holder");

  moviePlayer.style.background = "rgba(0, 0, 0, 0.5)";
  const token = localStorage.getItem("token");

  async function setupPlayer() {
    const content = await fetchContentDetails(filmId);

    const player = videojs(moviePlayer);

    const mediaUrl = content.media_url;
    const sourceType = mediaUrl.includes(".m3u8")
      ? "application/x-mpegURL"
      : mediaUrl.includes(".mpd")
      ? "application/dash+xml"
      : "video/mp4";

    player.src({ src: mediaUrl, type: sourceType });

    moviePlayer.style.display = "block";
    videoHolder.style.backgroundImage = "none";

    watchMovie.style.display = "none";
    watchMovieButton.style.display = "none";
    watchTrailerButton.style.display = "none";
    // downloadContentButton.style.display = 'none';

    if (mediaUrl && downloadContentButton) {
      downloadContentButton.style.display = "inline-block"; // Exibe o botão de download
      downloadContentButton.addEventListener("click", function () {
        // Inicia o download usando a solução Blob
        fetch(mediaUrl)
          .then((response) => {
            if (!response.ok) throw new Error("Erro ao baixar o vídeo");
            return response.blob(); // Converte a resposta em um Blob
          })
          .then((blob) => {
            const url = URL.createObjectURL(blob); // Cria um URL para o Blob
            const a = document.createElement("a"); // Cria um elemento <a>
            a.href = url; // Define o href para o URL do Blob
            a.download = film.title + ".mp4"; // Define o nome do arquivo para download
            document.body.appendChild(a); // Adiciona o elemento ao DOM
            a.click(); // Simula o clique no link
            a.remove(); // Remove o elemento <a> do DOM
            URL.revokeObjectURL(url); // Libera a memória do Blob
          })
          .catch((error) => {
            displayError(error.message);
          });
      });
    } else {
      downloadContentButton.style.display = "none"; // Esconde o botão de download se não houver URL
    }

    player.ready(function () {
      player.play();
    });
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

  if (watchTrailerButton) {
    watchTrailerButton.addEventListener("click", function () {
      const title = film.title;
      if (title) {
        const searchQuery = encodeURIComponent(`${title} trailer`);
        const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;

        window.open(youtubeSearchUrl, "_blank");
      } else {
        alert("Título do filme não disponível para pesquisa.");
      }
    });
  }
}

// Inicialização ao carregar o DOM
document.addEventListener("DOMContentLoaded", async function () {
  showLoading();
  const film = await fetchMovieDetails(filmId);
  displayFilmDetails(film);

  setupVideoPlayer(film);
});
