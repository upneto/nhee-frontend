// Exemplo de listagem de textos usando TextService
console.log('Texts page loaded');

// Estado da página
let currentFilters = {
    search: '',
    area: '',
    type: '',
    concept: '',
    page: 1,
    limit: 20
};

// Carregar textos da API
async function loadTexts() {
    try {
        // Obter filtros atuais
        currentFilters.search = document.getElementById('searchTexts')?.value || '';
        currentFilters.area = document.getElementById('filterArea')?.value || '';
        currentFilters.type = document.getElementById('filterType')?.value || '';
        currentFilters.concept = document.getElementById('filterConcepts')?.value || '';
        
        // Chamar API usando TextService
        const response = await TextService.list(currentFilters);
        
        // Renderizar lista de textos
        renderTexts(response.data || response);
        
        // Atualizar paginação se houver
        if (response.pagination) {
            updatePagination(response.pagination);
        }
        
    } catch (error) {
        console.error('Erro ao carregar textos:', error);
        showAlert(error.message, 'danger');
    }
}

// Renderizar textos no DOM
function renderTexts(texts) {
    const textsList = document.getElementById('textsList');
    
    if (!textsList) return;
    
    if (!texts || texts.length === 0) {
        textsList.innerHTML = `
            <div class="alert alert-info">
                Nenhum texto encontrado com os filtros aplicados.
            </div>
        `;
        return;
    }
    
    textsList.innerHTML = texts.map(text => `
        <div class="text-card" onclick="window.location.hash='text-view?id=${text.id}'">
            <h3>${text.title}</h3>
            <p class="text-meta">
                <span class="area">${text.area}</span>
                ${text.type ? `<span class="type">${text.type}</span>` : ''}
            </p>
            <p class="text-excerpt">${text.excerpt || text.content.substring(0, 200)}...</p>
            ${text.authenticity ? `
                <div class="authenticity-badge">
                    Autenticidade: ${text.authenticity.toFixed(1)}/10
                </div>
            ` : ''}
            <div class="text-footer">
                <span>Por ${text.author}</span>
                <span>${new Date(text.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
    `).join('');
}

// Atualizar paginação
function updatePagination(pagination) {
    // Implementar conforme necessário
    console.log('Pagination:', pagination);
}

// Função para criar novo texto
function handleNewText() {
    if (!AuthService.isAuthenticated()) {
        alert('Para criar um novo texto, você precisa fazer login primeiro.');
        window.location.hash = 'login';
        return;
    }
    
    window.location.hash = 'new-text';
}

// Função para limpar filtros
function clearFilters() {
    document.getElementById('searchTexts').value = '';
    document.getElementById('filterArea').value = '';
    document.getElementById('filterType').value = '';
    document.getElementById('filterConcepts').value = '';
    
    currentFilters = {
        search: '',
        area: '',
        type: '',
        concept: '',
        page: 1,
        limit: 20
    };
    
    loadTexts();
}

// Função para aplicar filtros
function applyFilters() {
    currentFilters.page = 1; // Reset para primeira página
    loadTexts();
}

// Mostrar alerta
function showAlert(message, type = 'danger') {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;
    
    alertContainer.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => {
        alertContainer.innerHTML = '';
    }, 5000);
}

// Tornar funções globais
window.handleNewText = handleNewText;
window.clearFilters = clearFilters;
window.applyFilters = applyFilters;

// Inicialização quando DOM estiver pronto
setTimeout(() => {
    // Verificar se há filtro de conceito no localStorage
    const filterConcept = localStorage.getItem('filterConcept');
    if (filterConcept) {
        const searchInput = document.getElementById('searchTexts');
        if (searchInput) {
            searchInput.value = filterConcept;
        }
        localStorage.removeItem('filterConcept');
    }

    // Verificar autenticação
    const isLoggedIn = AuthService.isAuthenticated();
    const authWarning = document.getElementById('authWarning');
    const newTextContainer = document.getElementById('newTextContainer');

    if (!isLoggedIn && authWarning) {
        authWarning.style.display = 'block';
    }
    
    if (isLoggedIn && newTextContainer) {
        newTextContainer.style.display = 'block';
    }

    // Event listeners para filtros
    const searchInput = document.getElementById('searchTexts');
    const filterArea = document.getElementById('filterArea');
    const filterType = document.getElementById('filterType');
    const filterConcepts = document.getElementById('filterConcepts');

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (filterArea) filterArea.addEventListener('change', applyFilters);
    if (filterType) filterType.addEventListener('change', applyFilters);
    if (filterConcepts) filterConcepts.addEventListener('input', applyFilters);

    // Carregar textos inicialmente
    loadTexts();
}, 100);
