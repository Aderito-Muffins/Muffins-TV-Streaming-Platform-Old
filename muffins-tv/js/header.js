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
                if (callback) callback(element)
            })
            .catch(error => {
                console.error(`Erro ao carregar ${elementType}:`, error);
            });
    }

    // Função para atualizar o menu de usuário autenticado
    function updateAuthenticatedMenu(userData) {
        const menu = document.getElementById('menu-acc');
        if (menu) {
            menu.innerHTML = `
<a class="dropdown-item" href="#"><i class="fas fa-sign-out-alt"></i> Sair (${userData.fullName})</a>
<a class="dropdown-item" href="user-profile.html"><i class="fa fa-user"></i> Perfil</a>
<a class="dropdown-item" href="library.html"><i class="fa fa-indent"></i> Biblioteca</a>
<a class="dropdown-item" href="upload-video.html"><i class="fa fa-upload"></i> Enviar Vídeo</a>
            `;
        }
    }

    // Função para carregar o header e o footer
    function loadHeaderAndFooter() {
        // Carregar o header
        loadHtmlResource('html/header.html', 'header', 'gen-header', async function (headerElement) {
            const token = localStorage.getItem('token');

            if (token) {
                try {
                    const response = await fetch('http://localhost:3000/muffins/v1/users/me', { // Corrija a URL aqui
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}` // Inclua o token no cabeçalho
                        }
                    });
    
                    const data = await response.json();
    
                    if (data.code === 0) {
                        const assinebt = document.getElementById('bt-assine');
                        // Atualizar o menu com os dados do usuário
                        updateAuthenticatedMenu(data.user);
                        const special = data.user.specialPackage.isActive; // Verifica se o pacote especial está ativo
                        const plan = data.user.subscriptionPlan !== 'Nenhum'; // Verifica se o plano de assinatura é diferente de 'Nenhum'
                    
                        
                        // Se o pacote especial está ativo OU se há um plano de assinatura
                        if (special || plan) {
                            assinebt.style.display = 'none'; // Oculta o botão
                        }
                         // Passa os dados do usuário para a função de atualização
                    } else {
                        console.error("Error fetching user data:", data.message);
                        // Tratar o caso onde a resposta contém um erro
                    }
                } catch (error) {
                    console.error("Network error:", error);
                    // Tratar erros de rede ou outros problemas
                }
            } else {
                console.warn("No token found in localStorage.");
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
