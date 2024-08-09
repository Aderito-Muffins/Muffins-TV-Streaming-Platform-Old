
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";
  import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
  import { getFirestore, collection, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

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
  const analytics = getAnalytics(app);
  const auth = getAuth(app);
  const db = getFirestore(app);

  // Função de validação de email
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Função de validação de senha
  function isValidPassword(password) {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  }

  // Função de validação de nome de usuário
  function isValidUsername(username) {
    const re = /^[a-zA-Z0-9_]{3,20}$/;
    return re.test(username);
  }

  // Função para exibir erros no HTML
  function displayError(message) {
    const errorElement = document.getElementById('form-errors');
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  // Função para criar o login e armazenar dados no Firestore
  function createLogin(email, password, username, firstName, lastName) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Obter o usuário registrado
        const user = userCredential.user;

        // Armazenar informações adicionais no Firestore
        return setDoc(doc(db, 'users', user.uid), {
          username: username,
          firstName: firstName,
          lastName: lastName,
          email: email,
          createdAt: serverTimestamp()
        });
      })
      .then(() => {
        // Cadastro e armazenamento bem-sucedidos
        alert("Você foi registrado com sucesso!");

        // Limpar os campos do formulário
        document.getElementById("pms_register-form").reset();
      })
      .catch((error) => {
        // Tratar erros específicos do Firebase
        let errorMessage = "Ocorreu um erro ao fazer o cadastro.";
        
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = "O email fornecido não é válido.";
            break;
          case 'auth/email-already-in-use':
            errorMessage = "Este email já está em uso.";
            break;
          case 'auth/weak-password':
            errorMessage = "A senha deve ter pelo menos 6 caracteres.";
            break;
          case 'auth/missing-email':
            errorMessage = "O email é obrigatório.";
            break;
          case 'auth/operation-not-allowed':
            errorMessage = "A operação de criação de usuário não é permitida.";
            break;
          default:
            errorMessage = error.message;
            break;
        }

        displayError(errorMessage);
      });
  }

  // Adicionar evento ao formulário
  document.getElementById('pms_register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // Limpar mensagens de erro anteriores
    displayError('');

    // Obter os dados do formulário
    const email = document.getElementById('pms_user_email').value;
    const password = document.getElementById('pms_pass1').value;
    const username = document.getElementById('pms_user_login').value;
    const firstName = document.getElementById('pms_first_name').value;
    const lastName = document.getElementById('pms_last_name').value;

    // Validar o email
    if (!isValidEmail(email)) {
      displayError("Por favor, insira um email válido.");
      return;
    }

    // Validar a senha
    if (!isValidPassword(password)) {
      displayError("A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.");
      return;
    }

    // Validar se as senhas coincidem
    if (password !== document.getElementById('pms_pass2').value) {
      displayError("As senhas não coincidem.");
      return;
    }

    // Validar o nome de usuário
    if (!isValidUsername(username)) {
      displayError("O nome de usuário deve ter entre 3 e 20 caracteres e pode conter apenas letras, números e underscores.");
      return;
    }

    // Validar campos obrigatórios
    if (!email || !password || !username) {
      displayError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Chamar a função de criar login
    createLogin(email, password, username, firstName, lastName);
  });
