// Função para exibir erros no HTML

function displayError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
  }
}

// Função para mostrar o loader
function showLoading() {
  document.querySelector('.loader-container').style.display = 'flex';
}

// Função para esconder o loader
function hideLoading() {
  document.querySelector('.loader-container').style.display = 'none';
}

// Função para realizar o login
async function loginUser(email, password) {
  try {
    const bodyData = {
      email: email,
      pass: password
    };

    console.log("Dados enviados:", bodyData); // Log para depuração

    const response = await fetch('http://localhost:3000/muffins/v1/users/login', { // Verifique se a URL está correta
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    });

    const data = await response.json();

    if (response.ok) {
      hideLoading();
      alert("Login feito com sucesso!");

      // Armazena os dados do usuário e token no localStorage
      localStorage.setItem('token', data.token);

      // Redireciona para a página principal
      window.location.href = "/index.html";

      // Limpa o formulário de login
      document.getElementById("pms_login").reset();
    } else {
      hideLoading();
      console.error("Erro da API:", data); // Log de erro
      displayError('form-errors', data.msg || "Ocorreu um erro ao fazer o login.");
    }
  } catch (error) {
    hideLoading();
    console.error('Erro de requisição:', error); // Log de erro
    displayError('form-errors', "Ocorreu um erro ao fazer o login.");
  }
}

// Adicionar evento ao formulário de login
document.getElementById('pms_login').addEventListener('submit', (e) => {
  e.preventDefault();

  // Obter os dados do formulário
  const email = document.getElementById('user_login').value;
  const password = document.getElementById('user_pass').value;

  // Mostrar loading
  showLoading();

  // Chamar a função de login
  loginUser(email, password);
});

// Verifica o estado de login ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const currentPath = window.location.pathname;

  // Verifique se o usuário está na página de login
  const isLoginPage = currentPath.includes("/log-in.html");

  if (token) {
    try {
      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000; // O timestamp atual em segundos

      if (decodedToken.exp < currentTime) {
        // Token expirado
        localStorage.removeItem('token');
        if (!isLoginPage) {
          window.location.href = "/log-in.html"; // Redireciona para a página de login
        }
      } else {
        // Token ainda válido
        if (isLoginPage) {
          window.location.href = "/index.html"; // Redireciona para a página principal
        }
      }
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      localStorage.removeItem('token');
      if (!isLoginPage) {
        window.location.href = "/log-in.html"; // Redireciona para a página de login se ocorrer um erro
      }
    }
  } else {
    // Nenhum token encontrado
    if (!isLoginPage) {
      window.location.href = "/log-in.html"; // Redireciona para a página de login
    }
  }
});

