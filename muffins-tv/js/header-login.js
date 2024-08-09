import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

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

// Função para verificar o estado de autenticação e atualizar o menu
function updateMenu(user) {
  const menu = document.getElementById('gen-account-menu');
  if (user) {
    // Usuário está logado
    menu.innerHTML = `
      <li>
        <a href="#" id="logout"><i class="fas fa-sign-out-alt"></i> Logout</a>
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
        alert("Você foi desconectado com sucesso.");
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
