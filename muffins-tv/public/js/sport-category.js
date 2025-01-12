document.addEventListener("DOMContentLoaded", function () {
  let limit = 4; // Quantos filmes carregar por vez
  let offset = 0; // Controle de páginação inicial

  // Extrai o ID da URL
  const urlParams = new URLSearchParams(window.location.search);
  const categoryId = urlParams.get("id") || 3; // Altere 'id' para o nome correto do parâmetro na URL

  // Verifica se o ID é válido
  if (!categoryId) {
    console.error("Category ID is missing in the URL");
    return;
  }

  // Função para carregar filmes da API com base no ID
  async function loadMovies() {
    try {
      // Mostra o ícone de carregamento
      document.querySelector(".loadmore-icon").style.display = "inline-block";
      document.querySelector(".button-text").textContent = "Carregando...";

      // Faz requisição para sua API usando o ID
      const response = await fetch(
        ` https://muffinstvapi.onrender.com/muffins/v1/sports/category/list/${categoryId}&limit=${limit}&offset=${offset}`
      );
      const result = await response.json();

      if (result.code === 0 && result.data) {
        const movies = result.data;
        renderMovies(movies);

        // Atualiza o offset para carregar a próxima página de resultados
        offset += limit;
      } else {
        console.log("No more data available");
      }
    } catch (error) {
      console.error("Error loading movies:", error);
    } finally {
      // Esconde o ícone de carregamento
      document.querySelector(".loadmore-icon").style.display = "none";
      document.querySelector(".button-text").textContent = "Load More";
    }
  }

  // Função para renderizar os filmes no HTML
  function renderMovies(movies) {
    const container = document.getElementById("movies-container");
    movies.forEach((movie) => {
      const movieHtml = `
                <div class="col-xl-3 col-lg-4 col-md-6">
                    <div class="gen-carousel-movies-style-2 movie-grid style-2">
                        <div class="gen-movie-contain">
                            <div class="gen-movie-img">
                                <img src="${movie.thumb}" alt="single-video-image">
                                <div class="gen-movie-add">
                                    <!-- Ações do filme (ícone de coração, compartilhamento, etc.) -->
                                </div>
                                <div class="gen-movie-action">
                                    <a href="single-video.html?id=${movie.id}&title=${movie.title}" class="gen-button">
                                        <i class="fa fa-play"></i>
                                    </a>
                                </div>
                            </div>
                            <div class="gen-info-contain">
                                <div class="gen-movie-info">
                                    <h3><a href="single-video.html?id=${movie.id}&title=${movie.title}">${movie.title}</a></h3>
                                </div>
                                <div class="gen-movie-meta-holder">
                                    <ul>
                                        <li>Live | Video</li>
                                        <li><a href="#"><span>futebol</span></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
      container.insertAdjacentHTML("beforeend", movieHtml);
    });
  }

  // Adiciona o evento de clique ao botão "Load More"
  document
    .getElementById("load-more-btn")
    .addEventListener("click", function (event) {
      event.preventDefault();
      loadMovies();
    });

  // Carrega os primeiros filmes quando a página carrega
  loadMovies();
});
