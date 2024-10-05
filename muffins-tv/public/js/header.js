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
                    throw new Error('Erro ao carregar o recurso');
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
<a class="dropdown-item" id="user-Profile" href="#"><i class="fas fa-sign-out-alt"></i> Sair (${userData.fullName})</a>
<a class="dropdown-item" href="user-profile.html"><i class="fa fa-user"></i> Perfil</a>
<a class="dropdown-item" href="library.html"><i class="fa fa-indent"></i> Biblioteca</a>
            `;
        }
    }

    // Função para carregar o header e o footer
    function loadHeaderAndFooter() {
        // Carregar o header
        loadHtmlResource('html/header.html', 'header', 'gen-header', async function (headerElement) {
            const token = localStorage.getItem('token');
            const currentPath = window.location.pathname; // Obter a URL da página atual
            console.log(currentPath)
            // Ocultar o botão "Assine" em todas as páginas com esses padrões no caminho da URL
        // Ocultar o botão "Assine" em todas as páginas com esses padrões no caminho da URL
        const pagesToHideButton = ['/single-movie', '/single-tv', '/pricing'];

        // Verifica se o caminho da URL atual contém qualquer padrão da lista
        if (pagesToHideButton.some(path => currentPath.includes(path))) {

            // Seleciona o botão "Assine" pelo id 'bt-assine'
            const subscribeButton = document.getElementById('bt-assine');
            
            if (subscribeButton) {
                // Remover 'display: none' inline primeiro
                subscribeButton.style.display = 'none'; // Ocultar o botão "Assine"
            }
        }
            if (token) {
                try {
                    const response = await fetch('https://muffins-tv-api-2f0282275534.herokuapp.com/muffins/v1/users/me', { 
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
    
                    const data = await response.json();
    
                    if (data.code === 0) { 
                        // Atualiza o menu com os dados do usuário
                        updateAuthenticatedMenu(data.user);
                    
                        const { specialPackage, subscription } = data.user;
                        const isSpecialActive = specialPackage.isActive;  
                        const isPlanActive = subscription.status === 'active';  
                        const textPlans = document.getElementsByClassName('bt-assine-class');
                    
                        // Itera sobre os elementos encontrados
                        for (let i = 0; i < textPlans.length; i++) {
                            const textPlan = textPlans[i];
                    
                            if (isPlanActive) {
                                textPlan.innerText = subscription.planName;
                            } else if (isSpecialActive) {
                                textPlan.innerText = 'ESPECIAL';
                            } else {
                                textPlan.innerText = 'Assine';
                            }
                        }
                    } else {
                        console.error("Error fetching user data:", data.message);
                    }
                } catch (error) {
                    console.error("Network error:", error);
                }
            } 
    
            // Mover o formulário de pesquisa para fora do header
            const searchForm = document.getElementById('search-form');
            if (searchForm) {
                document.body.appendChild(searchForm);
            }
    
            // Configurar o botão de busca e o formulário de pesquisa após o carregamento do cabeçalho
            const searchButton = document.getElementById('gen-search-btn');
            const signOut = document.getElementById('user-Profile');
    
            if (searchButton && searchForm) {
                searchButton.addEventListener('click', function() {
                    // Alterna a exibição do formulário de busca
                    if (searchForm.style.display === 'none' || searchForm.style.display === '') {
                        searchForm.style.display = 'flex';
                    } else {
                        searchForm.style.display = 'none';
                    }
                    // Alterna a classe 'active' para mostrar/ocultar o formulário
                    searchForm.classList.toggle('active');
                });
    
                // Configurar o comportamento do formulário de pesquisa
                const searchFormElement = searchForm.querySelector('form');
                if (searchFormElement) {
                    searchFormElement.addEventListener('submit', function(event) {
                        event.preventDefault(); // Impede o envio padrão do formulário
                        const searchValue = searchFormElement.querySelector('.search-field').value;
                        const searchUrl = `movies-founds.html?s=${encodeURIComponent(searchValue)}`;
                        window.location.href = searchUrl;
                    });
                }
            }
    
            if (signOut) {
                signOut.addEventListener('click', async function() {
                    const userConfirmed = confirm("Você tem certeza que deseja sair?");
                    if (userConfirmed) {
                        const token = localStorage.getItem('token');
                        try {
                            const response = await fetch('https://muffins-tv-api-2f0282275534.herokuapp.com/muffins/v1/users/logout', { 
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                }
                            });
    
                            const data = await response.json();
    
                            if (response.ok) {
                                localStorage.removeItem('token');
                                window.location.href = "/index.html";
                            } else {
                                console.error("Erro no logout:", data.message || "Erro desconhecido");
                            }
                        } catch (error) {
                            console.error("Erro de rede:", error);
                        }
                    } else {
                        console.log("Usuário cancelou o logout.");
                    }
                });
            }
        });

        loadHtmlResource('html/footer.html', 'footer', 'gen-footer', function(footerElement) {
            console.log("Footer carregado com sucesso!");
            // Adicionar outros comportamentos para o footer, se necessário
        });
    }

    // Carregar o header e footer ao carregar a página
    loadHeaderAndFooter();
});
