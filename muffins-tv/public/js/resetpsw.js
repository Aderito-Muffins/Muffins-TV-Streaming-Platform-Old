import config from './config.js';

function mostrarLoader() {
    document.querySelector('.loader-container').style.display = 'flex'; // Usa 'flex' para centralizar
}

// Função para esconder o loader
function esconderLoader() {
    document.querySelector('.loader-container').style.display = 'none'; // Oculta o loader
}

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

}

function displaySuccess(message) {
    const successContainer = document.getElementById('success-container');
    const successText = successContainer.querySelector('.success-text');
    successText.textContent = message;
    successContainer.style.display = 'block';
    setTimeout(function () {
        successContainer.style.display = 'none';
    }, 4000);

}

// Função para validar senha
function isValidPassword(password) {
    return password.length >= 6; // Ajuste se necessário
}

document.getElementById("pms_reset").addEventListener("submit", async function (e) {
    e.preventDefault();

    const pass1 = document.getElementById("pms_pass1").value;
    const pass2 = document.getElementById("pms_pass2").value;

    mostrarLoader();

    if (!isValidPassword(pass1)) {
        displayError("A senha deve conter pelo menos 6 caracteres.");
        esconderLoader();
        return;
    }

    if (pass1 !== pass2) {
        displayError("As senhas não coincidem.");
        esconderLoader();
        return;
    }

    // Captura o token da URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
        displayError("Token não encontrado.");
        esconderLoader();
        return;
    }

    try {
        const response = await fetch(`${config.API_URL}/users/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                token: token,
                newPassword: pass1    
            })
        });

        const result = await response.json();

        if (result.code === 0) {
            if(!result.token){
                displayError("Falha do lado do servidor, token experado!"); 
                return;
            }
            localStorage.setItem('token', result.token)
            displaySuccess("Senha redefinida com sucesso!");
            esconderLoader();
            // Redirecionar para login ou outra página
            setTimeout(() => {
                window.location.href = "/index.html";
            }, 2000);
        } else {
            displayError(result.message);
            esconderLoader();
        }
    } catch (error) {
        console.error("Erro ao redefinir senha:", error);
        displayError("Ocorreu um erro. Tente novamente mais tarde.");
        esconderLoader();
    }
});
