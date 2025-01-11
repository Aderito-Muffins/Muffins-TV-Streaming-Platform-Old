const baseUrl = "https://app.muffinstv.com/muffins/v1/anime/list/category"; // Substitua pela URL real da sua API

// Variáveis globais para controle de página, limite e gênero
let currentPage = 1;
const limit = 12; // Número de filmes por página, você pode modificar este valor conforme necessário
let genre = getGenreFromURL() || "Action"; // Gênero inicial selecionado

// Função para mostrar e ocultar o loader
function showLoading() {
  document.querySelector(".loader-container").style.display = "flex";
}

function hideLoading() {
  document.querySelector(".loader-container").style.display = "none";
}

// Função para capturar o parâmetro "genre" da URL
function getGenreFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("genre");
}

// Função para carregar filmes com base nos parâmetros de página e gênero
async function loadFilms(page = 1, selectedGenre = genre) {
  genre = selectedGenre; // Atualiza o gênero global com o selecionado
  showLoading();
  try {
    // Montando a URL de requisição com os parâmetros de paginação e gênero
    const url = `${baseUrl}?limit=${limit}&page=${page}`;

    // Fazendo a requisição para a API
    const response = await fetch(url);
    const data = await response.json();

    if (data.code === 0) {
      // Verifica se o código de sucesso é retornado
      displayFilms(data.data); // Chama a função para exibir filmes
      updatePagination(Math.ceil(data.data.total / limit), page); // Atualiza a paginação
    } else {
      console.error(data.message);
    }
  } catch (error) {
    console.error("Erro ao carregar filmes:", error);
  } finally {
    hideLoading();
  }
}

// Função para exibir filmes no HTML
function displayFilms(films) {
  const container = document.querySelector(".categories-container");
  if (!container) {
    console.error("Elemento .row_Movies não encontrado");
    return;
  }

  // Limpar conteúdo existente
  container.innerHTML = "";

  // Loop para adicionar cada filme ao container
  films.forEach((film) => {
    const filmHTML = `
            <div class="anime-explore-container">
                <ul class="anime">
                    <li class="anime-item">
                        <a href="/animes/category.html?id=${film.id}" aria-current="page">
                            <span>${film.name}</span>
                        </a>
                    </li>
                </ul>
            </div>
        `;
    container.insertAdjacentHTML("beforeend", filmHTML);
  });
}

// Função para capturar cliques nos links de gênero
document.querySelectorAll(".genre-link").forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    const selectedGenre = this.getAttribute("data-genre");
    currentPage = 1; // Reinicia a página para 1 ao mudar o gênero
    loadFilms(currentPage, selectedGenre); // Carrega filmes do gênero selecionado
    window.location.href = "#gen-section-padding-3";
  });
});

// Função para atualizar a paginação
function updatePagination(totalPages, currentPage) {
  const paginationContainer = document.querySelector(".page-numbers");
  if (!paginationContainer) {
    console.error("Elemento de paginação não encontrado");
    return;
  }

  // Limpar a paginação existente
  paginationContainer.innerHTML = "";

  // Adicionar botão para "Primeira Página"
  if (currentPage > 1) {
    paginationContainer.innerHTML += `<li><a class="page-numbers" href="#" data-page="1">First</a></li>`;
  }

  // Adicionar botão de página anterior
  if (currentPage > 1) {
    paginationContainer.innerHTML += `<li><a class="prev page-numbers" id='prevPage' href="#">Prev</a></li>`;
  }

  // Mostrar no máximo 5 páginas ao redor da página atual
  const maxPagesToShow = 5;
  const half = Math.floor(maxPagesToShow / 2);
  let startPage = Math.max(currentPage - half, 1);
  let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

  // Ajustar o startPage quando há poucas páginas no final
  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(endPage - maxPagesToShow + 1, 1);
  }

  // Adicionar botões de página
  for (let i = startPage; i <= endPage; i++) {
    if (i === currentPage) {
      paginationContainer.innerHTML += `<li><span class="page-numbers current">${i}</span></li>`;
    } else {
      paginationContainer.innerHTML += `<li><a class="page-numbers" href="#" data-page="${i}">${i}</a></li>`;
    }
  }

  // Adicionar botão de próxima página
  if (currentPage < totalPages) {
    paginationContainer.innerHTML += `<li><a class="next page-numbers" id='nextPage' href="#">Next</a></li>`;
  }

  // Adicionar botão para "Última Página"
  if (currentPage < totalPages) {
    paginationContainer.innerHTML += `<li><a class="page-numbers" href="#" data-page="${totalPages}">Last</a></li>`;
  }

  // Adicionar eventos para os botões de paginação
  document.querySelectorAll(".page-numbers a").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const page = event.target.getAttribute("data-page");

      if (page) {
        loadFilms(parseInt(page));
        window.scrollTo({ top: 0, behavior: "smooth" }); // Rolagem suave para o topo da página
      } else if (event.target.id === "prevPage") {
        prevPage();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (event.target.id === "nextPage") {
        nextPage();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });
}

// Funções para Paginação
function nextPage() {
  currentPage++;
  loadFilms(currentPage);
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    loadFilms(currentPage);
  }
}

// Carregar os filmes na primeira vez que a página é aberta com o gênero capturado da URL
loadFilms(currentPage);
