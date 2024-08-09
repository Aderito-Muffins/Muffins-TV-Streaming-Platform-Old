import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { updateMenu } from "./header-login.js";
import { app } from "./onlyfirebase.js";
//import { updateMenu } from "../js/header-login.js";

//login.js

// Configuração do Firebase

// Inicializar Firebase
const auth = getAuth(app);
const db = getFirestore(app);
let user = null;  // Corrigido para 'let' ao invés de 'const'

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

// Função para obter dados do Firestore com base no uid do usuário
async function getUserData(uid) {
  const userDocRef = doc(db, "users", uid);
  try {
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      localStorage.setItem('userData', JSON.stringify(userData));
      return userData;
    } else {
      console.log("Nenhum documento encontrado para o UID fornecido.");
      return null;
    }
  } catch (error) {
    console.error("Erro ao obter os dados do Firestore:", error);
    return null;
  }
}
// Função para realizar o login
function loginUser(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      alert("Login realizado com sucesso!");

      // Obter dados do usuário do Firestore e atualizar o menu
      const userData = await getUserData(user.uid);
      if (userData) {
        updateMenu(user);
      }
      
      //window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Erro ao fazer login:", error.message);
    })
    .finally(() => {
      hideLoading();
    });
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