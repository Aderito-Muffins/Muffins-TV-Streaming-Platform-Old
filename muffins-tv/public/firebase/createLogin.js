import config from '../js/config.js';

// Função para exibir o loader
function mostrarLoader() {
    document.querySelector('.loader-container').style.display = 'flex'; // Usa 'flex' para centralizar
}

// Função para esconder o loader
function esconderLoader() {
    document.querySelector('.loader-container').style.display = 'none'; // Oculta o loader
}

// Função para mostrar a seção de verificação
function mostrarCode() {
    const verificationSection = document.getElementById('verification-code-section');
    verificationSection.style.display = 'block'; // Exibe a seção
    const verificationInput = document.getElementById('verification_code');
    verificationInput.setAttribute('required', 'true');
    const bt = document.getElementById('verify-button');
    bt.style.display = 'block'
}

// Função para esconder o formulário de registro
function esconderFormulario() {
    const registerSection = document.getElementById('register-section');
    registerSection.style.display = 'none';
    const bt = document.getElementById('register-button');
    bt.style.display = 'none'
}

// Função para gerar ou recuperar o deviceId do navegador
function getDeviceId() {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
        deviceId = 'device-' + Math.random().toString(36).substr(2, 16);
        localStorage.setItem('deviceId', deviceId);
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
  
    // Fecha automaticamente após 4 segundos (4000 ms)
    setTimeout(function () {
        errorContainer.style.display = 'none';
    }, 4000);

    closeButton.addEventListener('click', function () {
        errorContainer.style.display = 'none'; // Esconde o container de erro quando clicado
    });

}
// Função para exibir alerta de sucesso
function displaySuccess(message) {
    const successContainer = document.getElementById('success-container');
    const successText = successContainer.querySelector('.success-text');
    successText.textContent = message;
    successContainer.style.display = 'block';
    setTimeout(function () {
        successContainer.style.display = 'none';
    }, 4000);

    closeButton.addEventListener('click', function () {
        successContainer.style.display = 'none'; // Esconde o container de erro quando clicado
    });
}

// Função para validar e-mail
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Função para validar senha
function isValidPassword(password) {
    return password.length >= 6; // Ajuste se necessário
}



// Função para criar o login e armazenar dados usando sua API
async function createLogin(email, password, fullname, phone) {
    try {
        const deviceId = getDeviceId();
        const bodyData = {
            fullName: fullname,
            email: email,
            pass: password,
            phone: phone,
            deviceId: deviceId
        };

        const response = await fetch(`${config.API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
        });

        const data = await response.json();

        if (response.ok && data.code === 0) {
            esconderFormulario();
            mostrarCode();
            esconderLoader();
            displaySuccess(data.message);
        } else {
            esconderLoader();
            displayError(data.message || "Ocorreu um erro ao fazer o cadastro.");
        }
    } catch (error) {
        esconderLoader();
        displayError("Ocorreu um erro ao fazer o cadastro.");
    }
}

// Função para verificar o código
async function verifyAccount(email, code) {
    try {
        const response = await fetch(`${config.API_URL}/users/verify-email?code=${code}&email=${email}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        if (response.ok && data.code === 0) {
            if(!data.token){
                displaySuccess("Ocorreu algum erro!"); 
                return;
            }
            localStorage.setItem('token', data.token)
            displaySuccess("Conta verificada com sucesso!");
            
            // Redirecionar ou realizar outra ação após a verificação
        } else {
            displayError(data.message || "Código de verificação inválido.");
        }
    } catch (error) {
        displayError("Erro ao verificar a conta.");
    }
}

// Adicionar evento ao formulário de registro
document.getElementById('pms_register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    mostrarLoader();
    const email = document.getElementById('pms_user_email').value;
    const password = document.getElementById('pms_pass1').value;
    const fullname = document.getElementById('pms_user_fullname').value;
    const phone = document.getElementById('pms_user_phone').value;

    if (!isValidEmail(email)) {
        displayError("Por favor, insira um email válido.");
        esconderLoader();
        return;
    }

    if (!isValidPassword(password)) {
        displayError("A senha deve conter pelo menos 6 caracteres.");
        esconderLoader();
        return;
    }

    if (password !== document.getElementById('pms_pass2').value) {
        displayError("As senhas não coincidem.");
        esconderLoader();
        return;
    }

    createLogin(email, password, fullname, phone);
});

// Evento para verificar o código
document.getElementById('verify-button').addEventListener('click', async () => {
    const email = document.getElementById('pms_user_email').value; // Obtenha o email novamente, se necessário
    const code = document.getElementById('verification_code').value;

    if (!code) {
        displayError("Por favor, insira o código de verificação.");
        return;
    }

    await verifyAccount(email, code);
});
