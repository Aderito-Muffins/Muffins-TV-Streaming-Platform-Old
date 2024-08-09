import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { app } from "./onlyfirebase.js";
// Inicializar o Firebase Auth
const auth = getAuth(app);

// Função para verificar o estado de autenticação e atualizar o menu
export function updateMenu(user) {
  const menu = document.getElementById('gen-account-menu');
  if (user) {
    // Recuperar dados do usuário armazenados no localStorage
    const userData = JSON.parse(localStorage.getItem('userData'));

    menu.innerHTML = `
      <li>
        <a href="#" id="logout"><i class="fas fa-sign-out-alt"></i> Logout (${userData.firstname} ${userData.lastname})</a>
      </li>
      <li>
        <a href="profile.html"><i class="fa fa-user"></i> Perfil</a>
      </li>
      <li>
        <a href="library.html">
          <i class="fa fa-indent"></i> Biblioteca
        </a>
      </li>
      <li>
        <a href="library.html"><i class="fa fa-list"></i> Playlist de Filmes</a>
      </li>
      <li>
        <a href="library.html"><i class="fa fa-list"></i> Playlist de Programas de TV</a>
      </li>
      <li>
        <a href="library.html"><i class="fa fa-list"></i> Playlist de Vídeos</a>
      </li>
      <li>
        <a href="upload-video.html"> <i class="fa fa-upload"></i> Enviar Vídeo</a>
      </li>
    `;

    // Adicionar evento de logout
    document.getElementById('logout').addEventListener('click', () => {
      signOut(auth).then(() => {
        // Limpar os dados do localStorage ao desconectar
        localStorage.removeItem('userData');
        alert("Você foi desconectado com sucesso.");
        window.location.href = "log-in.html"; // Redirecionar para a página de login
      }).catch((error) => {
        console.error("Erro ao desconectar: ", error.message);
      });
    });
  } else {
    // Usuário não está logado
    menu.innerHTML = `
      <li id="login-item">
        <a href="log-in.html"><i class="fas fa-sign-in-alt"></i> Login </a>
      </li>
      <li id="register-item">
        <a href="register.html"><i class="fa fa-user"></i> Registrar </a>
      </li>
      <li>
        <a href="library.html">
          <i class="fa fa-indent"></i> Biblioteca
        </a>
      </li>
      <li>
        <a href="library.html"><i class="fa fa-list"></i> Playlist de Filmes </a>
      </li>
      <li>
        <a href="library.html"><i class="fa fa-list"></i> Playlist de Programas de TV </a>
      </li>
      <li>
        <a href="library.html"><i class="fa fa-list"></i> Playlist de Vídeos </a>
      </li>
      <li>
        <a href="upload-video.html"> <i class="fa fa-upload"></i> Enviar Vídeo </a>
      </li>
    `;
  }
}

// Observar o estado de autenticação
onAuthStateChanged(auth, (user) => {
  updateMenu(user);
});
