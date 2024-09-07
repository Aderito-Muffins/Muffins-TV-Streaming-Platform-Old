document.addEventListener("DOMContentLoaded", function () {
    // Função para exibir erros no HTML
    function displayError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    // Funções para mostrar e ocultar o loader
    function showLoading() {
        const loadingElement = document.getElementById('gen-loading');
        if (loadingElement) loadingElement.style.display = 'block';
    }

    function hideLoading() {
        const loadingElement = document.getElementById('gen-loading');
        if (loadingElement) loadingElement.style.display = 'none';
    }

    // Função genérica para carregar um recurso HTML
    function loadHtmlResource(url, elementType, elementId, callback) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar o recurso: ' + url);
                }
                return response.text();
            })
            .then(data => {
                const element = document.createElement(elementType);
                element.id = elementId;
                element.innerHTML = data;
                document.body.insertAdjacentElement(elementType === 'header' ? 'afterbegin' : 'beforeend', element);
                if (callback) callback(element);
            })
            .catch(error => {
                console.error(`Erro ao carregar ${elementType}:`, error);
            });
    }

    // Função para atualizar o menu de usuário autenticado
    function updateAuthenticatedMenu(userData) {
        const menu = document.getElementById('gen-account-menu');
        if (menu) {
            menu.innerHTML = `
                <ul class="gen-account-menu">
                    <li>
                        <a onclick="userLogout();"><i class="fas fa-sign-out-alt"></i> Sair (${userData.fullName})</a>
                    </li>
                    <li>
                        <a href="user-profile.html"><i class="fa fa-user"></i> Perfil</a>
                    </li>
                    <li>
                        <a href="library.html"><i class="fa fa-indent"></i> Biblioteca</a>
                    </li>
                    <li>
                        <a href="library.html"><i class="fa fa-list"></i> Playlist de Filmes</a>
                    </li>
                    <li>
                        <a href="library.html"><i class="fa fa-list"></i> Playlist de Programas de TV</a>
                    </li>
                    <li>
                        <a href="library.html"><i class="fa fa-list"></i> Playlist de Vídeos</a>
                    </li>
                    <li>
                        <a href="upload-video.html"><i class="fa fa-upload"></i> Enviar Vídeo</a>
                    </li>
                </ul>
            `;
        }
    }

    // Função para carregar o header e o footer
    function loadHeaderAndFooter() {
        // Carregar o header
        loadHtmlResource('html/header.html', 'header', 'gen-header', function (headerElement) {
            const userData = localStorage.getItem('userData');
            if (userData) {
                updateAuthenticatedMenu(JSON.parse(userData));
            }

            // Configurar o botão de busca e o formulário de pesquisa após o carregamento do cabeçalho
            const searchButton = document.getElementById('gen-search-btn');
            const searchForm = document.querySelector('#search-form');

            if (searchButton && searchForm) {
                searchButton.addEventListener('click', function() {
                    if (searchForm.style.display === 'none' || searchForm.style.display === '') {
                        searchForm.style.display = 'flex';
                    } else {
                        searchForm.style.display = 'none';
                    }
                });

                // Configurar o comportamento do formulário de pesquisa
                const searchFormElement = document.querySelector('#search-form form');
                if (searchFormElement) {
                    searchFormElement.addEventListener('submit', function(event) {
                        event.preventDefault(); // Impede o envio padrão do formulário
                        const searchValue = searchFormElement.querySelector('.search-field').value;
                        const searchUrl = `movies-founds.html?s=${encodeURIComponent(searchValue)}`;
                        window.location.href = searchUrl;
                    });
                }
            }
        });

        // Carregar o footer
        loadHtmlResource('html/footer.html', 'footer', 'gen-footer');
    }

    // Carregar o header e footer ao carregar a página
    loadHeaderAndFooter();
});
