// Funções para exibir e esconder o loader
function showLoading() {
    document.querySelector('.loader-container').style.display = 'flex';
}
  
function hideLoading() {
    document.querySelector('.loader-container').style.display = 'none';
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
                    <td><button class="gen-button" onclick="openMpesaModal('${plan.id}', '${plan.name}', '${plan.price}')">Assine</button></td>
                </tr>
            `).join('');

            tableBody.innerHTML = planRowTemplate;
        } else {
            console.error('Erro ao buscar planos:', result.message);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    } finally {
        hideLoading(); // Esconde o loader após a operação, independentemente do resultado
    }
});

function openMpesaModal(planId, planName, planPrice) {
    // Preencher detalhes do plano no modal
    document.getElementById('planName').textContent = planName;
    document.getElementById('planPrice').textContent = planPrice + ' MZN';
    document.getElementById('planId').value = planId; // Armazenar o ID do plano no modal
    
    // Mostrar o modal
    document.getElementById('mpesaModal').style.display = 'flex';
}

function closeMpesaModal() {
    document.getElementById('mpesaModal').style.display = 'none';
}

async function submitMpesa() {
    const phoneNumber = document.getElementById('phoneNumber').value;
    const planId = document.getElementById('planId').value; // Obtém o planId do campo oculto
    const planName = document.getElementById('planName').textContent;
    const planPrice = document.getElementById('planPrice').textContent;

    if (phoneNumber) {
        const formattedPhoneNumber = `258${phoneNumber.replace(/^\+258/, '')}`; // Adiciona o prefixo e remove qualquer prefixo existente
        
        showLoading(); // Exibe o loader ao iniciar o pagamento
        
        try {
            const response = await fetch('https://muffins-tv-api-2f0282275534.herokuapp.com/muffins/v1/purchase/subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    msisdn: formattedPhoneNumber, // Usa o número formatado com o prefixo
                    planId: planId
                })
            });

            const result = await response.json();

            if (result.code === 0) {
                alert(`Pagamento iniciado com sucesso para o número ${formattedPhoneNumber}, referente ao plano ${planName} no valor de ${planPrice}.`);
                closeMpesaModal();
            } else {
                alert(`Erro ao processar o pagamento: ${result.message}`);
            }
        } catch (error) {
            console.error('Erro na requisição de pagamento:', error);
            alert('Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.');
        } finally {
            hideLoading(); // Esconde o loader após a operação, independentemente do resultado
        }
    } else {
        alert('Por favor, insira um número de celular válido.');
    }
}
