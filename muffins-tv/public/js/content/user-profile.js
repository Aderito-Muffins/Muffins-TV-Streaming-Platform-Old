// URL base da API para obter os detalhes do filme
const baseApiUrl = 'https://app.muffinstv.wuaze.com/muffins/v1/';

function showLoading() {
    document.querySelector('.loader-container').style.display = 'flex'; // Exibe o loader
}

function hideLoading() {
    document.querySelector('.loader-container').style.display = 'none'; // Oculta o loader
}

// Função para buscar os detalhes do filme da API
async function aboutMe() {
    const token = localStorage.getItem('token');
    try {
        showLoading(); // Exibe o loader antes de iniciar a requisição

        const response = await fetch(`${baseApiUrl}users/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Inclua o token no cabeçalho
            }
        });

        hideLoading(); // Oculta o loader após a resposta

        if (!response.ok) {
            throw new Error('Erro ao buscar dados do usuário');
        }

        const result = await response.json();
        if (result.code !== 0) {
            throw new Error(result.message || 'Erro ao buscar o usuário');
        }

        return result.user;
    } catch (error) {
        hideLoading(); // Certifique-se de ocultar o loader mesmo em caso de erro
        console.error('Erro ao buscar o usuário:', error);
        return null;
    }
}

// Função para exibir os detalhes do usuário no HTML
function displayUserDetails(user) {
    if (!user) {
        alert('Não foi possível carregar os detalhes do usuário.');
        return;
    }

    // Atualizar os elementos com base na estrutura HTML fornecida
    const profileNameElement = document.querySelector('.gen-user-profile .list-group-item:nth-child(1)'); // Nome
    const profileEmailElement = document.querySelector('.gen-user-profile .list-group-item:nth-child(2)'); // Email
    const profilePhoneElement = document.querySelector('.gen-user-profile .list-group-item:nth-child(3)'); // Número de Telemóvel
    const profileRegistrationDateElement = document.querySelector('.gen-user-profile .list-group-item:nth-child(4)'); // Data de Cadastro
    const profileLastLoginElement = document.querySelector('.gen-user-profile .list-group-item:nth-child(5)'); // Último Login
    
    const formattedReg = new Date(user.registrationDate).toLocaleDateString('pt-PT');
    const formattedLastLog = new Date(user.lastLogin).toLocaleDateString('pt-PT');
    if (profileNameElement) profileNameElement.innerHTML = `<strong>Nome:</strong> ${user.fullName || 'Nome não disponível'}`;
    if (profileEmailElement) profileEmailElement.innerHTML = `<strong>Email:</strong> ${user.email || 'Email não disponível'}`;
    if (profilePhoneElement) profilePhoneElement.innerHTML = `<strong>Numero de Telemovel:</strong> ${user.phone || 'Número de Telemóvel não disponível'}`;
    if (profileRegistrationDateElement) profileRegistrationDateElement.innerHTML = `<strong>Data de Cadastro:</strong> ${formattedReg || 'Data de Cadastro não disponível'}`;
    if (profileLastLoginElement) profileLastLoginElement.innerHTML = `<strong>Último Login:</strong> ${formattedLastLog || 'Último Login não disponível'}`;

    // Atualizar preferências do usuário, se necessário
    const preferencesGenresElement = document.querySelector('.gen-user-preferences .list-group-item:nth-child(1)'); // Gêneros Favoritos
    const preferencesNotificationsElement = document.querySelector('.gen-user-preferences .list-group-item:nth-child(2)'); // Notificações
    const preferencesLanguageElement = document.querySelector('.gen-user-preferences .list-group-item:nth-child(3)'); // Idioma Preferido
    const preferencesSubscriptionElement = document.querySelector('.gen-user-preferences .list-group-item:nth-child(4)'); // Plano de Assinatura
    const preferencesSpecialPackageElement = document.querySelector('.gen-user-preferences .list-group-item:nth-child(5)'); // Pacote Especial
    let planName = 'Nenhum'; // Alterado para 'let' para permitir reatribuição

    if (user.subscription && user.subscription.status === 'active') {
        planName = user.subscription.planName; // Atualiza o plano se a assinatura estiver ativa
    }
    
    if (preferencesGenresElement) {
        const favoriteGenres = user.preferences.favoriteGenres;
        if (Array.isArray(favoriteGenres) && favoriteGenres.length > 0) {
            preferencesGenresElement.innerHTML = `<strong>Gêneros Favoritos:</strong> ${favoriteGenres.join(', ')}`;
        } else {
            preferencesGenresElement.innerHTML = `<strong>Gêneros Favoritos:</strong> Não definido`;
        }
    }
    
    
    if (preferencesNotificationsElement) {
        preferencesNotificationsElement.innerHTML = `<strong>Notificações:</strong> ${user.preferences.notificationsEnabled ? 'Ativadas' : 'Desativadas'}`;
    }
    
    if (preferencesLanguageElement) {
        preferencesLanguageElement.innerHTML = `<strong>Idioma Preferido:</strong> ${user.preferences.preferredLanguage || 'Não definido'}`;
    }
    
    if (preferencesSubscriptionElement) {
        const expirationDate = user.subscription?.expirationDate; // Acesso seguro à data de expiração
    
        if (planName && expirationDate) {
            const formattedExpirationDate = new Date(expirationDate).toLocaleDateString('pt-PT'); // Formata a data para 'dd/mm/aaaa'
            preferencesSubscriptionElement.innerHTML = `<strong>Plano de Assinatura:</strong> ${planName} <br><strong>Data de Expiração:</strong> ${formattedExpirationDate}`;
        } else if (planName === 'Nenhum' || planName === '' || planName === null) {
            preferencesSubscriptionElement.innerHTML = `<strong>Plano de Assinatura:</strong> ${planName}`;
        }
    }
    
    if (preferencesSpecialPackageElement) {
        const formatted = new Date(user.specialPackage.expirationDate).toLocaleDateString('pt-PT');
        preferencesSpecialPackageElement.innerHTML = `<strong>Pacote Especial:</strong> ${user.specialPackage?.isActive ? `Ativo até ${formatted}` : 'Não Ativo'}`;
    }
    
}    
// Inicialização ao carregar o DOM
document.addEventListener("DOMContentLoaded", async function () {
    const user = await aboutMe();
    displayUserDetails(user);
});
