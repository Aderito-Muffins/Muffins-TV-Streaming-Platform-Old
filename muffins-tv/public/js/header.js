function loadHeaderAndFooter() {
  const headerElement = document.getElementById("gen-header");
  const footerElement = document.getElementById("gen-footer");

  console.log(headerElement);
  if (headerElement && footerElement) {
    fetch("/html/header.html")
      .then((response) => response.text())
      .then((html) => {
        headerElement.innerHTML = html;
      });

    fetch("/html/footer.html")
      .then((response) => response.text())
      .then((html) => {
        footerElement.innerHTML = html;
      });
  } else {
    console.error("Elementos gen-header e/ou gen-footer não encontrados");
  }
}

function configureSportsLinkBehavior() {
  const sportsLink = document.getElementById("sportsLink");

  if (sportsLink) {
    if (window.location.href.includes("sport")) {
      sportsLink.classList.add("active");
    }

    sportsLink.addEventListener("click", () => {
      document
        .querySelectorAll(".nav-link")
        .forEach((link) => link.classList.remove("active"));
      sportsLink.classList.add("active");
    });
  }
}

async function apiRequest(url, options = {}) {
  const token = localStorage.getItem("token");
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await fetch(url, options);

  if (response.status === 401) {
    handleSessionExpired();
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  return response;
}

function handleSessionExpired() {
  localStorage.removeItem("token");
  updateAuthenticatedMenu("", false);
  alert("Sessão expirada. Faça login novamente.");
  window.location.href = "/log-in.html";
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

function updateAuthenticatedMenu(username = "", isAuthenticated = false) {
  const loggedInMenu = document.querySelector(".login-inMenu");
  const loggedOutMenu = document.querySelector(".login-outMenu");

  console.log(loggedInMenu, loggedOutMenu);
  if (loggedInMenu && loggedOutMenu) {
    if (isAuthenticated) {
      loggedInMenu.style.display = "block";
      loggedOutMenu.style.display = "none";
      const userNameElement = document.querySelector(".user-name");
      if (userNameElement) userNameElement.textContent = username;
    } else {
      loggedInMenu.style.display = "none";
      loggedOutMenu.style.display = "block";
    }
  }
}

async function validateTokenAndSetMenu() {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await apiRequest(
        `https://app.muffinstv.wuaze.com/muffins/v1/users/me`
      );
      if (response.ok) {
        const data = await response.json();
        updateAuthenticatedMenu(data.username, true);
      } else {
        handleSessionExpired();
      }
    } catch (error) {
      console.error("Erro ao validar token:", error.message);
      handleSessionExpired();
    }
  } else {
    updateAuthenticatedMenu("", false);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  async function configureSearchBehavior() {
    const searchForm = document.getElementById("search-form");
    const searchButton = document.getElementById("gen-search-btn");

    if (searchForm && searchButton) {
      searchButton.addEventListener("click", () => {
        const isHidden =
          searchForm.style.display === "none" ||
          searchForm.style.display === "";
        searchForm.style.display = isHidden ? "flex" : "none";
        searchForm.classList.toggle("active");
      });

      const searchFormElement = searchForm.querySelector("form");
      searchFormElement?.addEventListener("submit", (event) => {
        event.preventDefault();
        const searchValue = searchFormElement
          .querySelector(".search-field")
          .value.trim();
        if (searchValue) {
          const searchUrl = `${
            window.location.origin
          }/movies-founds.html?s=${encodeURIComponent(searchValue)}`;
          window.location.href = searchUrl;
        }
      });
    }
  }

  async function configureLogoutBehavior() {
    const signOut = document.getElementById("user-Profile");

    if (signOut) {
      signOut.addEventListener("click", async () => {
        if (confirm("Você tem certeza que deseja sair?")) {
          const token = localStorage.getItem("token");
          try {
            const response = await fetch(
              `https://app.muffinstv.wuaze.com/muffins/v1/users/logout`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (response.ok) {
              handleSessionExpired();
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

  loadHeaderAndFooter();
  configureSportsLinkBehavior();
  apiRequest();
  handleSessionExpired();
  validateTokenAndSetMenu();
  configureLogoutBehavior();
  // Inicia o carregamento do header e footer
});
