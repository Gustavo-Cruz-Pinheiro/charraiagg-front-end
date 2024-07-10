// Função para criar um card de item
function createCard(item) {
    const card = document.createElement('div');
    card.className = 'card';
    if (item.patrocinador) {
        card.classList.add('unavailable');
    }

    const cardImg = document.createElement('img');
    cardImg.className = 'card-img';
    cardImg.src = item.imagem;
    cardImg.alt = item.nome;

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const cardTitle = document.createElement('h3');
    cardTitle.className = 'card-title';
    cardTitle.textContent = item.nome;

    const cardPrice = document.createElement('p');
    cardPrice.className = 'card-price';
    cardPrice.textContent = item.preco;

    const cardStatus = document.createElement('p');
    cardStatus.className = 'card-status';
    cardStatus.textContent = item.patrocinador ? 'Indisponível' : 'Disponível';

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardPrice);
    cardBody.appendChild(cardStatus);

    card.appendChild(cardImg);
    card.appendChild(cardBody);

    return card;
}

document.addEventListener('DOMContentLoaded', async () => {

    try {
        // Busca os itens do servidor
        const response = await fetch('https://charraiagg-back-end.onrender.com/api/itens/');
        if (!response.ok) {
            throw new Error('Erro ao buscar itens');
        }
        const itens = await response.json();

        const container = document.getElementById('itens-container');

        // Função para renderizar os itens na interface
        const renderItens = () => {
            container.innerHTML = ''; // Limpa o container antes de renderizar novamente
            itens.forEach(item => {
                const card = createCard(item);
                container.appendChild(card);
            });
        };

        if (container) {
            renderItens(); // Renderiza os itens ao carregar a página

            const botaoCopiar = document.getElementById('botao-copiar');
            const telefoneSpan = document.getElementById('telefone');

            botaoCopiar.addEventListener('click', () => {
                const textoParaCopiar = telefoneSpan.textContent.trim();
                navigator.clipboard.writeText(textoParaCopiar)
                    .then(() => {
                        alert('Chave PIX copiada para área de transferência do seu dispositivo!');
                    })
                    .catch(err => {
                        console.error('Erro ao copiar telefone:', err);
                        alert('Erro ao copiar telefone. Verifique as permissões do navegador.');
                    });
            });
        }

        const itemSelect = document.getElementById('item-select');
        const sponsorForm = document.getElementById('sponsor-form');

        if (itemSelect && sponsorForm) {
            // Popula o select com os itens disponíveis
            itens.forEach((item, index) => {
                if (!item.patrocinador) {
                    const option = document.createElement('option');
                    option.value = index;
                    option.textContent = item.nome;
                    itemSelect.appendChild(option);
                }
            });

            // Adiciona o evento de submit para o formulário de patrocínio
            sponsorForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const selectedIndex = itemSelect.value;
                const sponsorName = document.getElementById('sponsor-name').value;


                try {
                    // Envia requisição PUT para modificar o patrocinador do item selecionado
                    const putResponse = await fetch(`https://charraiagg-back-end.onrender.com/api/itens/${encodeURIComponent(itens[selectedIndex].nome)}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ patrocinador: sponsorName }),
                    });

                    if (!putResponse.ok) {
                        console.log("putResponse")
                        console.log(putResponse)
                        throw new Error('Erro ao modificar patrocinador');
                    }

                    // Atualiza o patrocinador localmente
                    itens[selectedIndex].patrocinador = sponsorName;

                    // Mostra mensagem de sucesso
                    alert('Patrocinador adicionado com sucesso!');

                    // Re-renderiza os itens na interface
                    // renderItens();
                } catch (error) {
                    console.error('Erro ao modificar patrocinador:', error);
                    alert('Erro ao modificar patrocinador');
                }
            });
        }
    } catch (error) {
        console.error('Erro ao buscar itens do servidor:', error);
        alert('Erro ao buscar itens do servidor');
    }
});
