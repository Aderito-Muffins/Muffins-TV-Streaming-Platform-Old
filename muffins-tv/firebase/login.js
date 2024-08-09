import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBpc3rVv535LsoA23HIzY6Nw7RJ12_XfIg",
  authDomain: "muffins-tv.firebaseapp.com",
  projectId: "muffins-tv",
  storageBucket: "muffins-tv.appspot.com",
  messagingSenderId: "91564806107",
  appId: "1:91564806107:web:851c0ede7a03e420c0e1fe",
  measurementId: "G-TTN3KF61MY"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

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
// Função para realizar o login
function loginUser(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Login bem-sucedido
      alert("Login realizado com sucesso!");
      // Redirecionar ou realizar outras ações após login
      window.location.href = "index.html";
      
    })
    .catch((error) => {
      // Tratamento de erros específicos do Firebase
      let errorMessage = "";
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = "O endereço de e-mail não é válido.";
          break;
        case 'auth/user-disabled':
          errorMessage = "Este usuário foi desativado.";
          break;
        case 'auth/user-not-found':
          errorMessage = "Não há nenhum registro de usuário correspondente a este identificador. O usuário pode ter sido excluído.";
          break;
        case 'auth/wrong-password':
          errorMessage = "A senha é inválida ou o usuário não tem uma senha.";
          break;
        default:
          errorMessage = "Ocorreu um erro ao fazer login.";
          break;
      }
      displayError("login-errors", errorMessage);
    })
    .finally(() => {
      // Esconder o loading após o processo de login
      hideLoading();
    });
}

// Adicionar evento ao formulário de login
document.getElementById('pms_login').addEventListener('submit', (e) => {
  e.preventDefault();

  // Obter os dados do formulário
  const email = document.getElementById('user_login').value;
  const password = document.getElementById('user_pass').value;
  showLoading();
  // Chamar a função de login
  loginUser(email, password);
  
});
