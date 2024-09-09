
function displayError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
  }
}

function showLoading() {
  document.querySelector('.loader-container').style.display = 'flex';
}

function hideLoading() {
  document.querySelector('.loader-container').style.display = 'none';
}

// Função para obter dados do Firestore com base no uid do usuário

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
          alert("Login Feito com sucesso");
          document.getElementById("pms_login").reset();
         
          localStorage.setItem('userData', JSON.stringify(data.user));

          window.location.href= "/index.html"

          // Limpar o formulário
      } else {
          hideLoading();
          console.error("Erro da API:", data); // Log de erro
          displayError(data.msg || "Ocorreu um erro ao fazer o cadastro.");
      }
  } catch (error) {
      hideLoading();
      console.error('Erro de requisição:', error); // Log de erro
      displayError("Ocorreu um erro ao fazer o cadastro.");
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
