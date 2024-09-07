document.addEventListener("DOMContentLoaded", function() {
    const searchButton = document.getElementById('gen-search-btn');
    const searchForm = document.querySelector('.gen-search-form');
    const formElement = document.getElementById('search-form');
    const searchField = formElement.querySelector('.search-field');
    const resultContainer = document.querySelector('.row_Movies');

    // Adicionar um evento de clique ao botão de busca
    searchButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevenir o comportamento padrão
        // Alternar a visibilidade do formulário de busca
        if (searchForm.style.display === 'none' || searchForm.style.display === '') {
            searchForm.style.display = 'block'; // Mostrar o campo de pesquisa
        } else {
            searchForm.style.display = 'none'; // Ocultar o campo de pesquisa
        }
    });

    // Adicionar um evento de clique fora do campo de pesquisa para fechá-lo
    document.addEventListener('click', function(event) {
        if (!searchForm.contains(event.target) && !searchButton.contains(event.target)) {
            searchForm.style.display = 'none'; // Ocultar o campo de pesquisa se o clique for fora dele
        }
    });

    // Adicionar evento de submissão ao formulário de pesquisa
    formElement.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir a submissão padrão do formulário

        const title = searchField.value; // Capturar o valor do campo de pesquisa

        // Fazer a chamada para a API de busca de filmes
        searchFilms(title);
    });

    // Função para buscar filmes da API
    async function searchFilms(title) {
        try {
            const response = await fetch(`/films/search?title=${encodeURIComponent(title)}`);
            const data = await response.json();

            if (data.code === 0) { // Se a busca foi bem-sucedida
                displayFilms(data.data.films); // Exibir os filmes retornados
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching films:', error);
        }
    }

    // Função para exibir filmes no HTML
    function displayFilms(films) {
        if (!resultContainer) {
            console.error('Elemento .row_Movies não encontrado');
            return;
        }

        // Limpar o contêiner existente
        resultContainer.innerHTML = '';

        // Loop para adicionar cada filme ao contêiner
        films.forEach(film => {
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
                                        <li><a href="genre.html?genre=${film.category[0]?.title}"><span>${film.category[0]?.title || 'N/A'}</span></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            resultContainer.insertAdjacentHTML('beforeend', filmHTML);
        });
    }
});