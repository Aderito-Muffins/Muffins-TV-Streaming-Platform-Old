// Função para obter o parâmetro 'id' da URL
function getIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function getTitleFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("title");
}

function showLoading() {
  document.querySelector(".loader-container").style.display = "flex";
}

function hideLoading() {
  document.querySelector(".loader-container").style.display = "none";
}
// URL base da API para obter os detalhes do filme
const baseApiUrl = "https://app.muffinstv.com/muffins/v1/";
const filmId = getIdFromURL();
const title = getTitleFromURL();

// Função para buscar os detalhes do filme da API
async function fetchMovieDetails(id) {
  showLoading();
  const token = localStorage.getItem("token"); // Exibe o loader antes da requisição
  try {
    const response = await fetch(`${baseApiUrl}sports/detail/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();

    // Validações de erro na resposta da API
    if (result.code !== 0) {
      displayError(result.message || "Erro ao buscar o filme");
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
    displayError(error.message || "Erro ao buscar o filme");
    console.error("Erro ao buscar o filme:", error);
    return null;
  } finally {
    hideLoading(); // Oculta o loader após a requisição, seja sucesso ou erro
  }
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

async function fetchContentDetails(id) {
  showLoading();
  const token = localStorage.getItem("token"); // Exibe o loader antes da requisição
  try {
    const response = await fetch(`${baseApiUrl}sports/detail/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    // Validações de erro na resposta da API
    if (result.code !== 0) {
      displayError(result.message || "Erro ao buscar o conteúdo");
      throw new Error(result.message || "Erro ao buscar o conteúdo");
    }

    // Verifica se os dados retornados são válidos e se há itens no array
    if (!result.data || result.data.length === 0) {
      const message = "Nenhum dado de conteúdo disponível";
      displayError(message);
      throw new Error(message);
    }

    // Acessa o primeiro item do array
    const contentData = result.data[0];
    return contentData;
  } catch (error) {
    displayError(error || "Erro ao buscar o conteúdo");
    console.error("Erro ao buscar o conteúdo:", error);
    return null;
  } finally {
    hideLoading(); // Oculta o loader após a requisição, seja sucesso ou erro
  }
}

// Função para exibir os detalhes do filme no HTML
function displayFilmDetails(film) {
  // Verificações para garantir que os elementos existem antes de acessá-los
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

  // Atualiza o conteúdo dos elementos, se eles existirem
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

  // Define a imagem de capa
  const videoHolder = document.getElementById("gen-video-holder");
  if (videoHolder) {
    videoHolder.style.backgroundImage = `url(${film.thumb})`;
  }
}

// Função para configurar o player de vídeo usando Video.js
// Função para configurar o player de vídeo usando Video.js
function setupVideoPlayer(film) {
  const moviePlayer = document.getElementById("movie-player");
  const watchMovieButton = document.getElementById("watch-movie-btn");
  const watchMovie = document.getElementById("playBut");
  const watchTrailerButton = document.getElementById("watch-trailer-btn");
  const videoHolder = document.getElementById("gen-video-holder");

  moviePlayer.style.background = "rgba(0, 0, 0, 0.5)";

  if (watchMovieButton) {
    watchMovieButton.addEventListener("click", function () {
      if (moviePlayer && videoHolder) {
        setupPlayer();
      }
    });
  }

  if (watchMovie) {
    watchMovie.addEventListener("click", function () {
      if (moviePlayer && videoHolder) {
        setupPlayer();
      }
    });
  }

  if (watchTrailerButton) {
    watchTrailerButton.addEventListener("click", function () {
      // Obtém o título do filme
      const title = film.title;
      if (title) {
        // Cria a URL de pesquisa do YouTube
        const searchQuery = encodeURIComponent(`${title} trailer`);
        const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;

        // Abre a URL de pesquisa em uma nova aba
        window.open(youtubeSearchUrl, "_blank");
      } else {
        // Se o título não estiver disponível, exibe uma mensagem de erro ou faz algo alternativo
        alert("Título do filme não disponível para pesquisa.");
      }
    });
  }

  function setupPlayer() {
    // Inicializa o Video.js player, se ainda não estiver inicializado
    const player = videojs(moviePlayer);
    // Verifica a URL e o tipo de mídia
    const mediaUrl = film.media_url;
    const sourceType = mediaUrl.includes(".m3u8")
      ? "application/x-mpegURL"
      : mediaUrl.includes(".mpd")
      ? "application/dash+xml"
      : "video/mp4";

    // Verifique se a URL da mídia está correta

    // Atualiza a fonte do player
    player.src({ src: mediaUrl, type: sourceType });

    // Exibe o player de vídeo

    watchMovie.style.display = "none";
    moviePlayer.style.display = "block"; // Torna o player visível
    videoHolder.style.backgroundImage = "none"; // Remove o plano de fundo

    // Esconde os botões de assistir ao filme e trailer
    watchMovieButton.style.display = "none";

    // Força a reprodução
    player.ready(function () {
      player.play();
    });
  }
}

// Inicialização ao carregar o DOM
document.addEventListener("DOMContentLoaded", async function () {
  const film = await fetchMovieDetails(filmId);
  displayFilmDetails(film);
  setupVideoPlayer(film);
});
