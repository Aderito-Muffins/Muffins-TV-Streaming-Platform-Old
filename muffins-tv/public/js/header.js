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
    const loadingElement = document.getElementById("gen-loading");
    if (loadingElement) loadingElement.style.display = "block";
  }

  function hideLoading() {
    const loadingElement = document.getElementById("gen-loading");
    if (loadingElement) loadingElement.style.display = "none";
  }

  // Função genérica para carregar um recurso HTML
  function loadHtmlResource(url, elementType, elementId, callback) {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao carregar o recurso");
        }
        return response.text();
      })
      .then((data) => {
        const element = document.createElement(elementType);
        element.id = elementId;
        element.innerHTML = data;
        document.body.insertAdjacentElement(
          elementType === "header" ? "afterbegin" : "beforeend",
          element
        );
        if (callback) callback(element);
      })
      .catch((error) => {
        console.error(`Erro ao carregar ${elementType}:`, error);
      });
  }

  // Função para atualizar o menu de usuário autenticado
  function updateAuthenticatedMenu(userData) {
    const menu = document.getElementById("menu-acc");
    if (menu) {
      menu.innerHTML = `
<a class="dropdown-item" id="user-Profile" href="#"><i class="fas fa-sign-out-alt"></i> Sair (${userData.fullName})</a>
<a class="dropdown-item" href="/user-profile.html"><i class="fa fa-user"></i> Perfil</a>
<a class="dropdown-item" href="/library.html"><i class="fa fa-indent"></i> Biblioteca</a>
            `;
    }
  }

  function updateGenresMenu(datas) {
    const menu = document.getElementById("menu-genres");
    if (menu) {
      // Gerar os itens dinamicamente com base nos dados fornecidos
      const genresHtml = datas
        .map(
          (data) =>
            `<a class="dropdown-item" href="/movies-pagination.html?genre=${data.id}">${data.name}</a>`
        )
        .join("");

      // Atualizar o conteúdo do menu com os itens gerados
      menu.innerHTML = `
                ${genresHtml}
            `;
    }
  }

  // Função para carregar o header e o footer
  async function loadHeaderAndFooter() {
    // Carregar o header
    loadHtmlResource(
      "/html/header.html",
      "header",
      "gen-header",
      async (headerElement) => {
        const token = localStorage.getItem("token");
        const currentPath = window.location.pathname; // URL da página atual

        if (token) {
          try {
            // Obter dados do usuário
            const userResponse = await fetch(
              "https://app.muffinstv.wuaze.com/muffins/v1/users/me",
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const userData = await userResponse.json();

            if (userData.code === 0) {
              updateAuthenticatedMenu(userData.user);

              // Atualizar texto dos planos
              const { specialPackage, subscription } = userData.user;
              const isSpecialActive = specialPackage?.isActive;
              const isPlanActive = subscription?.status === "active";
              const textPlans =
                document.getElementsByClassName("bt-assine-class");
              for (let textPlan of textPlans) {
                textPlan.innerText = isPlanActive
                  ? subscription.planName
                  : isSpecialActive
                  ? "ESPECIAL"
                  : "Assine";
              }
            } else {
              handleAuthenticationError();
            }
          } catch (error) {
            console.error("Erro ao carregar dados do usuário:", error);
          }
        }

        // Carregar gêneros, independentemente do token
        try {
          const genresResponse = await fetch(
            "https://app.muffinstv.wuaze.com/muffins/v1/genres",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }), // Adicionar cabeçalho Authorization apenas se o token existir
              },
            }
          );
          const genresData = await genresResponse.json();

          if (genresData.code === 0) {
            updateGenresMenu(genresData.data);
          }
        } catch (error) {
          console.error("Erro ao carregar gêneros:", error);
        }
        footerPWA();
        configureSearchBehavior();
        configureLogoutBehavior();
        configureSportsLinkBehavior();
      }
    );

    // Carregar o footer
    loadHtmlResource("/html/footer.html", "footer", "gen-footer", () => {
      console.log("Footer carregado com sucesso!");
    });
  }

  function configureSearchBehavior() {
    const searchForm = document.getElementById("search-form");
    const searchButton = document.getElementById("gen-search-btn");

    if (searchForm && searchButton) {
      searchButton.addEventListener("click", () => {
        searchForm.style.display =
          searchForm.style.display === "none" || searchForm.style.display === ""
            ? "flex"
            : "none";
        searchForm.classList.toggle("active");
      });

      const searchFormElement = searchForm.querySelector("form");
      if (searchFormElement) {
        searchFormElement.addEventListener("submit", (event) => {
          event.preventDefault();
          const searchValue =
            searchFormElement.querySelector(".search-field").value;
          const baseUrl = `${window.location.origin}/movies-founds.html`; // Garante que é a raiz do site
          const searchUrl = `${baseUrl}?s=${encodeURIComponent(searchValue)}`;
          window.location.href = searchUrl;
        });
      }
    }
  }
  function footerPWA() {
    let deferredPrompt;

    window.addEventListener("beforeinstallprompt", (e) => {
      console.log("Evento beforeinstallprompt disparado");
      e.preventDefault();
      deferredPrompt = e;

      // Exibe todos os botões de instalação com a classe installPwaButton
      const installButtons = document.querySelectorAll(".installPwaButton");
      installButtons.forEach((button) => {
        button.style.display = "block";
      });
    });

    // Adiciona um evento de clique para todos os botões com a classe installPwaButton
    const installButtons = document.querySelectorAll(".installPwaButton");
    installButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        console.log("Botão de instalação clicado");
        if (deferredPrompt) {
          console.log("Exibindo o prompt de instalação");
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          console.log(`Resultado da instalação: ${outcome}`);
          deferredPrompt = null;
        } else {
          console.log("deferredPrompt não disponível");
        }
      });
    });
  }

  function configureLogoutBehavior() {
    const signOut = document.getElementById("user-Profile");

    if (signOut) {
      signOut.addEventListener("click", async () => {
        const userConfirmed = confirm("Você tem certeza que deseja sair?");
        if (userConfirmed) {
          const token = localStorage.getItem("token");
          try {
            const response = await fetch(
              "https://app.muffinstv.wuaze.com/muffins/v1/users/logout",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (response.ok) {
              localStorage.removeItem("token");
              window.location.href = "/index.html";
            } else {
              console.error("Erro no logout:", await response.json());
            }
          } catch (error) {
            console.error("Erro de rede:", error);
          }
        }
      });
    }
  }

  function configureSportsLinkBehavior() {
    const sportsLink = document.getElementById("sportsLink");
    const currentUrl = window.location.href;

    if (sportsLink) {
      if (currentUrl.includes("sport") || currentUrl.includes("sports")) {
        sportsLink.classList.add("active");
      }

      sportsLink.addEventListener("click", () => {
        const allLinks = document.querySelectorAll(".nav-link");
        allLinks.forEach((link) => link.classList.remove("active"));
        sportsLink.classList.add("active");
      });
    }
  }

  function handleAuthenticationError() {
    localStorage.removeItem("token");
    window.location.href = "/log-in.html";
  }

  // Carregar o header e footer ao carregar a página
  loadHeaderAndFooter();
});
