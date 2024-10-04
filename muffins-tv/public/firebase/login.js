// Função para exibir erros no HTML
function displayError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
  }
}

// Função para mostrar o loader
function showLoading() {
  const loader = document.querySelector('.loader-container');
  if (loader) loader.style.display = 'flex';
}

// Função para esconder o loader
function hideLoading() {
  const loader = document.querySelector('.loader-container');
  if (loader) loader.style.display = 'none';
}

// Função para realizar o login
async function loginUser(email, password) {
  try {
    const bodyData = { email, pass: password };

    const response = await fetch('https://muffins-tv-api-2f0282275534.herokuapp.com/muffins/v1/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData)
    });

    const data = await response.json();

    if (response.ok && data.code === 0) {
      hideLoading();
      localStorage.setItem('token', data.token);
      window.location.href = "index.html"; // Redireciona para a página principal
    } else {
      throw new Error(data.message || "Erro ao fazer login.");
    }
  } catch (error) {
    hideLoading();
    console.error('Erro de requisição:', error);
    showError(error.message || 'Erro inesperado.');
  }
}

// Função para exibir mensagens de erro
function showError(message) {
  const errorContainer = document.getElementById('error-container');
  if (errorContainer) {
    const errorText = errorContainer.querySelector('.error-text');
    const closeButton = errorContainer.querySelector('.close-button');

    errorText.textContent = message;
    errorContainer.style.display = 'block';

    setTimeout(() => {
      errorContainer.style.display = 'none';
    }, 4000);

    closeButton.addEventListener('click', () => {
      errorContainer.style.display = 'none';
    });
  }
}

// Adicionar evento ao formulário de login
document.getElementById('pms_login').addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('user_login').value;
  const password = document.getElementById('user_pass').value;

  if (email && password) {
    showLoading();
    loginUser(email, password);
  } else {
    showError('Preencha todos os campos.');
  }
});

// Verifica o estado de login ao carregar a página
window.addEventListener('DOMContentLoaded', async () => {
  setTimeout(() => {
    const token = localStorage.getItem('token');
    const currentPath = window.location.pathname;
    const isLoginPage = currentPath.includes("/log-in");

    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('token');
          if (!isLoginPage) window.location.href = "/log-in";
        } else if (isLoginPage) {
          window.location.href = "/index";
        }
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        localStorage.removeItem('token');
        if (!isLoginPage) window.location.href = "/log-in";
      }
    } else if (!isLoginPage) {
      window.location.href = "/log-in";
    }
  }, 500); // Pequeno atraso de 500ms
});

