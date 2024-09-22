import config from './config.js';

function mostrarLoader() {
    document.querySelector('.loader-container').style.display = 'flex';
}

function esconderLoader() {
    document.querySelector('.loader-container').style.display = 'none';
}

function displayError(message) {
    const errorContainer = document.getElementById('error-container');
    const errorText = errorContainer.querySelector('.error-text');
    const closeButton = errorContainer.querySelector('.close-button');

    errorText.textContent = message;
    errorContainer.style.display = 'block';

    setTimeout(function () {
        errorContainer.style.display = 'none';
    }, 4000);

    closeButton.addEventListener('click', function () {
        errorContainer.style.display = 'none';
    });
}

function displaySuccess(message) {
    const successContainer = document.getElementById('success-container');
    const successText = successContainer.querySelector('.success-text');
    const closeButtonSuccess = successContainer.querySelector('.close-button');
    
    successText.textContent = message;
    successContainer.style.display = 'block';

    setTimeout(function () {
        successContainer.style.display = 'none';
    }, 4000);

    closeButtonSuccess.addEventListener('click', function () {
        successContainer.style.display = 'none';
    });
}

document.getElementById('pms_recover_password_form').addEventListener('submit', async function (event) {
    event.preventDefault();

    mostrarLoader(); // Mostra o loader ao iniciar a submissão

    const email = document.getElementById('pms_username_email').value;
    if (!email) {
        displayError("Por favor, insira um endereço de e-mail válido.");
        esconderLoader(); // Esconde o loader em caso de erro
        return;
    }

    try {
        const response = await fetch(`${config.API_URL}/users/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email })
        });

        const data = await response.json();

        if (response.ok && data.code === 0) {
            displaySuccess(data.message);
        } else {
            displayError(data.message);
        }
    } catch (error) {
        console.error('Erro:', error);
        displayError("Ocorreu algum erro inesperado");
    } finally {
        esconderLoader(); // Esconde o loader ao finalizar a submissão
    }
});
