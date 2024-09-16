// Função para exibir o loader
function mostrarLoader() {
    document.querySelector('.loader-container').style.display = 'flex'; // Usa 'flex' para centralizar
}

// Função para esconder o loader
function esconderLoader() {
    document.querySelector('.loader-container').style.display = 'none'; // Oculta o loader
}

// Função para gerar ou recuperar o deviceId do navegador
function getDeviceId() {
    // Verifica se já existe um deviceId armazenado
    let deviceId = localStorage.getItem('deviceId');
    
    if (!deviceId) {
        // Se não existir, cria um novo identificador de dispositivo
        deviceId = 'device-' + Math.random().toString(36).substr(2, 16);
        localStorage.setItem('deviceId', deviceId); // Armazena no localStorage para uso futuro
    }

    return deviceId;
}

// Função para exibir erros no HTML
function displayError(message) {
    const errorContainer = document.getElementById('error-container');
    const errorText = errorContainer.querySelector('.error-text');
    const closeButton = errorContainer.querySelector('.close-button');
  
    // Define o texto da mensagem de erro
    errorText.textContent = message;
  
    // Exibe o container de erro
    errorContainer.style.display = 'block';
  
    // Adiciona evento de clique ao botão de fechar
    closeButton.addEventListener('click', function () {
      errorContainer.style.display = 'none'; // Esconde o container de erro quando clicado
    });
}

// Função de validação de email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Função de validação de senha
function isValidPassword(password) {
    const re = /^.{6,}$/;
    return re.test(password);
}


// Função para exibir o alerta de sucesso
function displaySuccess(message) {
    const successContainer = document.getElementById('success-container');
    const successText = successContainer.querySelector('.success-text');
    const closeButton = successContainer.querySelector('.close-button');
  
    // Define o texto da mensagem de sucesso
    successText.textContent = message;
  
    // Exibe o container de sucesso
    successContainer.style.display = 'block';
  
    // Adiciona evento de clique ao botão de fechar
    closeButton.addEventListener('click', function () {
      successContainer.style.display = 'none'; // Esconde o container de sucesso quando clicado
    });
}


// Função para criar o login e armazenar dados usando sua API
async function createLogin(email, password, fullname, phone) {
    try {
        const deviceId = getDeviceId(); // Obtém o deviceId
        const bodyData = {
            fullName: fullname,
            email: email,
            pass: password,
            phone: phone,
            deviceId: deviceId // Adiciona o deviceId ao corpo da requisição
        };

        console.log("Dados enviados:", bodyData); // Log para depuração

        const response = await fetch('https://muffins-tv-api-2f0282275534.herokuapp.com/muffins/v1/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)
        });

        const data = await response.json();

        if (response.ok && data.code === 0) {
            esconderLoader();
            localStorage.setItem('token', data.token);
            displaySuccess(data.message);
            document.getElementById("pms_register-form").reset(); // Limpar o formulário
            setTimeout(() => {
                window.location.href = "/log-in.html";
            }, 4200);
            // Armazena o token de autenticação no localStorage
        } else {
            esconderLoader();
            console.error("Erro da API:", data); // Log de erro
            displayError(data.message || "Ocorreu um erro ao fazer o cadastro.");
        }
    } catch (error) {
        esconderLoader();
        console.error('Erro de requisição:', error); // Log de erro
        displayError("Ocorreu um erro ao fazer o cadastro.");
    }
}

// Adicionar evento ao formulário
document.getElementById('pms_register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    mostrarLoader();
    // Limpar mensagens de erro anteriores

    // Obter os dados do formulário
    const email = document.getElementById('pms_user_email').value;
    const password = document.getElementById('pms_pass1').value;
    const fullname = document.getElementById('pms_user_fullname').value;
    const phone = document.getElementById('pms_user_phone').value;

    // Validar campos obrigatórios
    if (!isValidEmail(email)) {
        displayError("Por favor, insira um email válido.");
        esconderLoader();
        return;
    }

    if (!isValidPassword(password)) {
        displayError("A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.");
        esconderLoader();
        return;
    }

    // Validar se as senhas coincidem
    if (password !== document.getElementById('pms_pass2').value) {
        displayError("As senhas não coincidem.");
        esconderLoader();
        return;
    }

    // Validar campos obrigatórios
    if (!email || !password) {
        displayError("Por favor, preencha todos os campos obrigatórios.");
        esconderLoader();
        return;
    }

    // Chamar a função de criar login
    createLogin(email, password, fullname, phone);
});
