// Funções para exibir e esconder o loader
function showLoading() {
    document.querySelector('.loader-container').style.display = 'flex';
}

function hideLoading() {
    document.querySelector('.loader-container').style.display = 'none';
}
const plan = null;
// Funções para exibir mensagens de erro e sucesso
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

    // Esconde o container de erro automaticamente após 3 segundos (3000 milissegundos)
    setTimeout(function () {
        errorContainer.style.display = 'none';
    }, 3000);
}

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

    // Esconde o container de sucesso automaticamente após 3 segundos (3000 milissegundos)
    setTimeout(function () {
        successContainer.style.display = 'none';
    }, 3000);
}


document.addEventListener('DOMContentLoaded', async () => {
    showLoading(); // Exibe o loader ao iniciar o carregamento

    try {
        const response = await fetch('https://muffins-tv-api-2f0282275534.herokuapp.com/muffins/v1/plans/getPlans', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();

        if (result.code === 0) {
            const plans = result.data;
            const tableBody = document.querySelector('tbody');
            
            const planRowTemplate = plans.map(plan => `
                <tr>
                    <td><div class="class-tag">${plan.name}</div></td>
                    <td>${plan.price} MZN / ${plan.category}</td>
                    <td>${plan.maxDevices}</td>
                    <td>${plan.deviceDownload.isActive ? 'Todos' : 'Nenhum'}</td>
                    <td><i class="far ${plan.isActive ? 'fa-check-circle' : 'fa-times-circle'}"></i></td>
                    <td>${plan.withAds ? 'Com Anúncios' : 'Sem Anúncios'}</td>
                    <td><button class="gen-button" onclick='openPaymentModal(${JSON.stringify(plan)})'>PAGAR</button></td>
                </tr>
            `).join('');
        
            tableBody.innerHTML = planRowTemplate;
        }
         else {
            console.error('Erro ao buscar planos:', result.message);
            displayError('Erro ao buscar planos: ' + result.message);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        displayError('Erro na requisição: ' + error.message);
    } finally {
        hideLoading(); // Esconde o loader após a operação, independentemente do resultado
    }
});

// function openMpesaModal(planId, planName, planPrice) {
//     // Preencher detalhes do plano no modal
//     document.getElementById('planName').textContent = planName;
//     document.getElementById('planPrice').textContent = planPrice + ' MZN';
//     document.getElementById('planId').value = planId; // Armazenar o ID do plano no modal

//     // Mostrar o modal
//     document.getElementById('mpesaModal').style.display = 'flex';
// }

// function closeMpesaModal() {
//     document.getElementById('mpesaModal').style.display = 'none';
// }

async function submitPuchase(method, planId, number) {
    const token = localStorage.getItem('token')
    const phoneNumber = number;
 // Obtém o planId do campo oculto

    if(!token){
    displayError( `token inexistente, faca o login novamente!`);
    return
    }

    if (phoneNumber) {
        const formattedPhoneNumber = phoneNumber; // Adiciona o prefixo e remove qualquer prefixo existente

        showLoading(); // Exibe o loader ao iniciar o pagamento

        try {
            const response = await fetch('https://muffins-tv-api-2f0282275534.herokuapp.com/muffins/v1/purchase/subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    msisdn: formattedPhoneNumber, // Usa o número formatado com o prefixo
                    planId: planId,
                    paymentOption: method
                })
            });

            const result = await response.json();
            if (result.code === 0) {
                displaySuccess(result.message);
                closeMpesaModal();
                setTimeout(() => {
                    window.location.href = "/index.html";
                }, 4200);
            } else {
                displayError( `transação malsucedida`);
            }
        } catch (error) {
            console.error('Erro na requisição de pagamento:', error);
            displayError('Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.');
        } finally {
            hideLoading(); // Esconde o loader após a operação, independentemente do resultado
        }
    } else {
        displayError('Por favor, insira um número de celular válido.');
    }
}

function openPaymentModal(plan) {
    document.getElementById("paymentModal").style.display = "block";
    // Armazena o plano para passar para os modais de pagamento
    window.selectedPlan = plan;
}

function closePaymentModal() {
    document.getElementById("paymentModal").style.display = "none";
}


function openMpesaModal() {
    closePaymentModal(); // Fecha o modal de escolha
    document.getElementById("mpesaModal").style.display = "block";
    
    // Preenche os detalhes do plano no modal M-Pesa
    document.getElementById("planNameMpesa").textContent = window.selectedPlan.name;
    document.getElementById("planPriceMpesa").textContent = window.selectedPlan.price;
    document.getElementById("mpesaPlanId").value = window.selectedPlan.id;
}

function openEmolaModal() {
    closePaymentModal(); // Fecha o modal de escolha
    document.getElementById("emolaModal").style.display = "block";
    
    // Preenche os detalhes do plano no modal e-Mola
    document.getElementById("planNameEmola").textContent = window.selectedPlan.name;
    document.getElementById("planPriceEmola").textContent = window.selectedPlan.price;
    document.getElementById("emolaPlanId").value = window.selectedPlan.id;
}

function closeEmolaModal() {
    document.getElementById("emolaModal").style.display = "none";
}
function closeMpesaModal() {
    document.getElementById("mpesaModal").style.display = "none";
}

async function submitMpesa() {
    // Implementar lógica de pagamento com M-Pesa
    let phoneNumber = document.getElementById("mpesaPhoneNumber").value;
    let planId = document.getElementById("mpesaPlanId").value;
    let method = "Mpesa";
    // Enviar dados para o servidor...
    await submitPuchase(method,planId,phoneNumber);
}

async function submitEmola() {
    // Implementar lógica de pagamento com e-Mola
    let phoneNumber = document.getElementById("emolaPhoneNumber").value;
    let planId = document.getElementById("emolaPlanId").value;
    let method = "Emola";
    // Enviar dados para o servidor...
    await submitPuchase(method,planId,phoneNumber);
}