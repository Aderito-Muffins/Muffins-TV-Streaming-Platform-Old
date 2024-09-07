const baseUrl = 'http://localhost:3000/muffins/v1/films/full/list-all'; // Substitua pela URL real da sua API

// Variáveis globais para controle de página e limite
let currentPage = 1;
const limit = 12; // Número de filmes por página, você pode modificar este valor conforme necessário

function showLoading() {
    document.querySelector('.loader-container').style.display = 'flex';
  }
  
  function hideLoading() {
    document.querySelector('.loader-container').style.display = 'none';
  }

// Função para carregar filmes com base nos parâmetros de página
async function loadFilms(page = 1) {
    showLoading()
    try {
        // Montando a URL de requisição com os parâmetros de paginação
        const url = `${baseUrl}?limit=${limit}&page=${page}&sortBy=title&sortOrder=asc`; // Adicione outros parâmetros, se necessário

        // Fazendo a requisição para a API
        const response = await fetch(url);
        const data = await response.json();

        if (data.error_code === 0) {
            displayFilms(data.DetailFilms); // Chama a função para exibir filmes
            updatePagination(data.totalPages, page); // Atualiza a paginação
        } else {
            hideLoading();
            console.error(data.msg);
        }
    } catch (error) {
        hideLoading()
        console.error('Erro ao carregar filmes:', error);
    }
    hideLoading();
}

// Função para exibir filmes no HTML
function displayFilms(films) {
    const container = document.querySelector('.row_Movies');
    if (!container) {
        console.error('Elemento .row_Movies não encontrado');
        return;
    }

    // Limpar conteúdo existente
    container.innerHTML = '';

    // Loop para adicionar cada filme ao container
    films.forEach(film => {
      //  console.log(film.thumb);
        const filmHTML = `
            <div class="col-xl-3 col-lg-4 col-md-6">
                <div class="gen-carousel-movies-style-3 movie-grid style-3">
                    <div class="gen-movie-contain">
                        <div class="gen-movie-img">
                            <img src="${film.thumb}" alt="${film.title}">
                            <div class="gen-movie-add">
                                <!-- Ações do filme como curtidas, compartilhamento, etc. -->
                            </div>
                            <div class="gen-movie-action">
                                <a href="single-movie.html?id=${film.externalId}" class="gen-button">
                                    <i class="fa fa-play"></i>
                                </a>
                            </div>
                        </div>
                        <div class="gen-info-contain">
                            <div class="gen-movie-info">
                                <h3><a href="single-movie.html?id=${film.externalId}">${film.title}</a></h3>
                            </div>
                            <div class="gen-movie-meta-holder">
                                <ul>
                                    <li>${film.duration}</li>
                                    <li><a href="genre.html?genre=${film.category[1].title}"><span>${film.category[1].title}</span></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', filmHTML);
    });
}

// Função para atualizar a paginação
function updatePagination(totalPages, currentPage) {
    const paginationContainer = document.querySelector('.page-numbers');
    if (!paginationContainer) {
        console.error('Elemento de paginação não encontrado');
        return;
    }

    // Limpar a paginação existente
    paginationContainer.innerHTML = '';

    // Adicionar botão de página anterior
    if (currentPage > 1) {
        paginationContainer.innerHTML += `<li><a class="prev page-numbers" id='prevPage' href="#">Prev Page</a></li>`;
    }

    // Adicionar botões de página
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationContainer.innerHTML += `<li><span class="page-numbers current">${i}</span></li>`;
        } else {
            paginationContainer.innerHTML += `<li><a class="page-numbers" href="#" data-page="${i}">${i}</a></li>`;
        }
    }

    // Adicionar botão de próxima página
    if (currentPage < totalPages) {
        paginationContainer.innerHTML += `<li><a class="next page-numbers" id='nextPage' href="#">Next page</a></li>`;
    }

    // Adicionar eventos para os botões de paginação
    document.querySelectorAll('.page-numbers a').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const page = event.target.getAttribute('data-page');
            if (page) {
                loadFilms(parseInt(page));
            } else if (event.target.id === 'prevPage') {
                prevPage();
            } else if (event.target.id === 'nextPage') {
                nextPage();
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

// Carregar os filmes na primeira vez que a página é aberta
loadFilms(currentPage);
