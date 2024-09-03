
document.addEventListener("DOMContentLoaded", function () {
    // Função para exibir erros no HTML
    function displayError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    function showLoading() {
        document.getElementById('gen-loading').style.display = 'block';
    }

    function hideLoading() {
        document.getElementById('gen-loading').style.display = 'none';
    }


    // Função para atualizar o menu com base no estado de login

    // Carregar o header e footer
    function loadHeaderAndFooter() {
        fetch('html/header.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                const headerElement = document.createElement('header');
                headerElement.id = 'gen-header';

                if (localStorage.getItem('userData') != null) {
                    const userData = JSON.parse(localStorage.getItem('userData'));
                    console.log(userData)
                    headerElement.innerHTML = data;
                    document.body.insertBefore(headerElement, document.body.firstChild);
                    const menu = document.getElementById('gen-account-menu')
                    menu.innerHTML = `
                <ul class="gen-account-menu">
                               <!-- Menu PMS -->
                               <li>
                                  <a onclick="userLogout();" ><i class="fas fa-logout-in-alt" ></i>
                                     Sair (${userData.fullName}) </a>
                               </li>
                               <li>
                                  <a href="user-profile.html"><i class="fa fa-user"></i>
                                     Perfil </a>
                               </li>
                               <!-- Menu Biblioteca -->
                               <li>
                                  <a href="library.html">
                                     <i class="fa fa-indent"></i>
                                     Biblioteca </a>
                               </li>
                               <li>
                                  <a href="library.html"><i class="fa fa-list"></i>
                                     Playlist de Filmes </a>
                               </li>
                               <li>
                                  <a href="library.html"><i class="fa fa-list"></i>
                                     Playlist de Programas de TV </a>
                               </li>
                               <li>
                                  <a href="library.html"><i class="fa fa-list"></i>
                                     Playlist de Vídeos </a>
                               </li>
                               <li>
                                  <a href="upload-video.html"> <i class="fa fa-upload"></i>
                                     Enviar Vídeo </a>
                               </li>
                            </ul>
            `;


                    // Após carregar o header, verificar o estado de autenticação

                } else {
                    headerElement.innerHTML = data;
                    document.body.insertBefore(headerElement, document.body.firstChild);
                }
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation for header:', error);
            });

        fetch('html/footer.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                const footerElement = document.createElement('footer');
                footerElement.id = 'gen-footer';
                footerElement.innerHTML = data;
                document.body.appendChild(footerElement);
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation for footer:', error);
            });
    }

    // Carregar o header e footer ao carregar a página
    loadHeaderAndFooter();
});
