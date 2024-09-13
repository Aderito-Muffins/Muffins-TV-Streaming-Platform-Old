
// URL base da API para obter os detalhes do filme
const baseApiUrl = 'https://muffins-tv-api-2f0282275534.herokuapp.com/muffins/v1/';

// Função para buscar os detalhes do filme da API
async function aboutMe() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${baseApiUrl}users/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Inclua o token no cabeçalho
            }
        });
        if (!response.ok) {
            throw new Error('Erro ao buscar dados do filme');
        }

        const result = await response.json();
        if (result.code !== 0) {
            throw new Error(result.message || 'Erro ao buscar o filme');
        }

        return result.user;
    } catch (error) {
        console.error('Erro ao buscar o filme:', error);
        return null;
    }
}

// Função para exibir os detalhes do filme no HTML
function displayUserDetails(film) {
    if (!film) {
        alert('Não foi possível carregar os detalhes do User.');
        return;
    }

    // Atualizar os elementos com base na estrutura HTML fornecida
    const profileNameElement = document.querySelector('.gen-user-profile .list-group-item:nth-child(1)'); // Nome
    const profileEmailElement = document.querySelector('.gen-user-profile .list-group-item:nth-child(2)'); // Email
    const profileUsernameElement = document.querySelector('.gen-user-profile .list-group-item:nth-child(3)'); // Nome de Usuário
    const profilePhoneElement = document.querySelector('.gen-user-profile .list-group-item:nth-child(4)'); // Número de Telemóvel
    const profileRegistrationDateElement = document.querySelector('.gen-user-profile .list-group-item:nth-child(5)'); // Data de Cadastro
    const profileLastLoginElement = document.querySelector('.gen-user-profile .list-group-item:nth-child(6)'); // Último Login

    // Atualiza o conteúdo dos elementos, se eles existirem
    if (profileNameElement) profileNameElement.innerHTML = `<strong>Nome:</strong> ${film.fullName || 'Nome não disponível'}`;
    if (profileEmailElement) profileEmailElement.innerHTML = `<strong>Email:</strong> ${film.email || 'Email não disponível'}`;
    if (profileUsernameElement) profileUsernameElement.innerHTML = `<strong>Nome de Usuario:</strong> ${film.username || 'Nome de Usuário não disponível'}`;
    if (profilePhoneElement) profilePhoneElement.innerHTML = `<strong>Numero de Telemovel:</strong> ${film.phone || 'Número de Telemóvel não disponível'}`;
    if (profileRegistrationDateElement) profileRegistrationDateElement.innerHTML = `<strong>Data de Cadastro:</strong> ${film.registrationDate || 'Data de Cadastro não disponível'}`;
    if (profileLastLoginElement) profileLastLoginElement.innerHTML = `<strong>Último Login:</strong> ${film.lastLogin || 'Último Login não disponível'}`;

    // Atualizar preferências do usuário, se necessário
    const preferencesGenresElement = document.querySelector('.gen-user-preferences .list-group-item:nth-child(1)'); // Gêneros Favoritos
    const preferencesNotificationsElement = document.querySelector('.gen-user-preferences .list-group-item:nth-child(2)'); // Notificações
    const preferencesLanguageElement = document.querySelector('.gen-user-preferences .list-group-item:nth-child(3)'); // Idioma Preferido
    const preferencesSubscriptionElement = document.querySelector('.gen-user-preferences .list-group-item:nth-child(4)'); // Plano de Assinatura
    const preferencesSpecialPackageElement = document.querySelector('.gen-user-preferences .list-group-item:nth-child(5)'); // Pacote Especial

    // Atualiza o conteúdo dos elementos, se eles existirem
    if (preferencesGenresElement) preferencesGenresElement.innerHTML = `<strong>Gêneros Favoritos:</strong> ${film.favoriteGenres?.join(', ') || 'Não definido'}`;
    if (preferencesNotificationsElement) preferencesNotificationsElement.innerHTML = `<strong>Notificações:</strong> ${film.notificationsEnabled ? 'Ativadas' : 'Desativadas'}`;
    if (preferencesLanguageElement) preferencesLanguageElement.innerHTML = `<strong>Idioma Preferido:</strong> ${film.preferredLanguage || 'Não definido'}`;
    if (preferencesSubscriptionElement) preferencesSubscriptionElement.innerHTML = `<strong>Plano de Assinatura:</strong> ${film.subscriptionPlan || 'Nenhum'}`;
    if (preferencesSpecialPackageElement) preferencesSpecialPackageElement.innerHTML = `<strong>Pacote Especial:</strong> ${film.specialPackage?.isActive ? `Activo ate ${film.specialPackage.expirationDate}` : 'Não Ativo'}`;

    
}

// Função para configurar o player de vídeo usando Video.js
// Função para configurar o player de vídeo usando Video.js


// Inicialização ao carregar o DOM
document.addEventListener("DOMContentLoaded", async function () {
    const user = await aboutMe();
    displayUserDetails(user);

});
