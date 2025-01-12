const baseUrl = " https://muffinstvapi.onrender.com/muffins/v1/tv/list"; // Substitua pela URL real da sua API

// Variáveis globais para controle de página, limite, categoria e país
let currentPage = 1;
const limit = 12; // Número de canais por página
let category = getCategoryFromURL(); // Categoria inicial selecionada
let country = getCountryFromURL(); // País inicial selecionado

// Função para mostrar e ocultar o loader
function showLoading() {
  document.querySelector(".loader-container").style.display = "flex";
}

function hideLoading() {
  document.querySelector(".loader-container").style.display = "none";
}

// Função para capturar o parâmetro "category" da URL
function getCategoryFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("category");
}

// Função para capturar o parâmetro "country" da URL
function getCountryFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("country");
}

// Função para carregar canais com base nos parâmetros de página, categoria e país
async function loadChannels(
  page = 1,
  selectedCategory = category,
  selectedCountry = country
) {
  showLoading();
  try {
    let url;
    // Montando a URL de requisição com os parâmetros de paginação, categoria e país
    if (selectedCountry) {
      url = `${baseUrl}/country/${selectedCountry}?limit=${limit}&page=${page}`;
    } else if (selectedCategory) {
      url = `${baseUrl}/category/${selectedCategory}?limit=${limit}&page=${page}`;
    } else {
      url = `${baseUrl}?limit=${limit}&page=${page}`; // Para carregar todos os canais
    }

    // Fazendo a requisição para a API
    const response = await fetch(url);
    const data = await response.json();

    if (data.code === 0) {
      // Verifica se o código de sucesso é retornado
      displayChannels(data.data); // Chama a função para exibir canais
      updatePagination(Math.ceil(data.totalItems / limit), page); // Atualiza a paginação
    } else {
      console.error(data.message);
    }
  } catch (error) {
    console.error("Erro ao carregar canais:", error);
  } finally {
    hideLoading();
  }
}

// Função para exibir canais no HTML
function displayChannels(channels) {
  const container = document.querySelector(".row_Movies");
  if (!container) {
    console.error("Elemento .row_Movies não encontrado");
    return;
  }

  // Limpar conteúdo existente
  container.innerHTML = "";

  // Loop para adicionar cada canal ao container
  channels.forEach((channel) => {
    const channelHTML = `
            <div class="col-xl-3 col-lg-4 col-md-6">
                <div class="gen-carousel-movies-style-3 movie-grid style-3">
                    <div class="gen-movie-contain">
                        <div class="gen-tv-img">
                            <img src="${channel.thumb}" alt="${channel.title}">
                            <div class="gen-movie-add">
                                <!-- Ações do canal como curtidas, compartilhamento, etc. -->
                            </div>
                            <div class="gen-movie-action">
                                <a href="single-tv.html?id=${
                                  channel.id
                                }&title=${channel.title}" class="gen-button">
                                    <i class="fa fa-play"></i>
                                </a>
                            </div>
                        </div>
                        <div class="gen-info-contain">
                            <div class="gen-movie-info">
                                <h3><a href="single-tv.html?id=${
                                  channel.id
                                }&title=${channel.title}">${
      channel.title
    }</a></h3>
                            </div>
                            <div class="gen-movie-meta-holder">
                                <ul>
                                    <li>${channel.language}</li>
                                    <li>${channel.country}</li>
                                    <li><a href="genre.html?genre=${
                                      channel.category[0]
                                    }"><span>${
      channel.category[0] || "N/A"
    }</span></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    container.insertAdjacentHTML("beforeend", channelHTML);
  });
}

// Função para capturar cliques nos links de categoria
document.querySelectorAll(".category-link").forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    const selectedCategory = this.getAttribute("data-category");
    currentPage = 1; // Reinicia a página para 1 ao mudar a categoria
    loadChannels(currentPage, selectedCategory); // Carrega canais da categoria selecionada
    window.location.href = "#gen-section-padding-3"; // Rolagem para a seção
  });
});

// Função para capturar cliques nos links de país
document.querySelectorAll(".country-link").forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    const selectedCountry = this.getAttribute("data-country");
    currentPage = 1; // Reinicia a página para 1 ao mudar o país
    loadChannels(currentPage, category, selectedCountry); // Carrega canais do país selecionado
    window.location.href = "#gen-section-padding-3"; // Rolagem para a seção
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
    paginationContainer.innerHTML += `<li><a class="page-numbers" href="#" data-page="1">Primeira</a></li>`;
  }

  // Adicionar botão de página anterior
  if (currentPage > 1) {
    paginationContainer.innerHTML += `<li><a class="prev page-numbers" id='prevPage' href="#">Anterior</a></li>`;
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
    paginationContainer.innerHTML += `<li><a class="next page-numbers" id='nextPage' href="#">Próxima</a></li>`;
  }

  // Adicionar botão para "Última Página"
  if (currentPage < totalPages) {
    paginationContainer.innerHTML += `<li><a class="page-numbers" href="#" data-page="${totalPages}">Última</a></li>`;
  }

  // Adicionar eventos para os botões de paginação
  document.querySelectorAll(".page-numbers a").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const page = event.target.getAttribute("data-page");

      if (page) {
        loadChannels(parseInt(page));
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
  loadChannels(currentPage);
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    loadChannels(currentPage);
  }
}

// Carregar os canais na primeira vez que a página é aberta com a categoria e país capturados da URL
loadChannels(currentPage); // Carrega os canais inicialmente com a categoria e país
