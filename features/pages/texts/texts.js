// Texts Page JS
console.log('Texts page loaded');

// Função para tentar criar novo texto
function handleNewText() {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    
    if (!isLoggedIn) {
        alert('Para criar um novo texto, você precisa fazer login primeiro.');
        window.location.hash = 'login';
        return;
    }
    
    // Se autenticado, redirecionar para página de novo texto
    window.location.hash = 'new-text';
}

// Função para limpar filtros
function clearFilters() {
    document.getElementById('searchTexts').value = '';
    document.getElementById('filterArea').value = '';
    document.getElementById('filterType').value = '';
    document.getElementById('filterConcepts').value = '';
    
    // Disparar evento para atualizar lista
    applyFilters();
}

// Função para aplicar filtros
function applyFilters() {
    const searchTerm = document.getElementById('searchTexts').value.toLowerCase();
    const areaFilter = document.getElementById('filterArea').value;
    const typeFilter = document.getElementById('filterType').value;
    const conceptFilter = document.getElementById('filterConcepts').value.toLowerCase();
    
    // Aqui seria a lógica de filtrar textos
    console.log('Filtros aplicados:', { searchTerm, areaFilter, typeFilter, conceptFilter });
    
    // TODO: Implementar filtragem real dos textos quando integrado com backend
}

// Tornar funções globais
window.handleNewText = handleNewText;
window.clearFilters = clearFilters;
window.applyFilters = applyFilters;

// Usar setTimeout para garantir que elementos estejam no DOM
setTimeout(() => {
    // Verificar se há filtro de conceito no localStorage
    const filterConcept = localStorage.getItem('filterConcept');
    if (filterConcept) {
        // Aplicar filtro
        const searchInput = document.getElementById('searchTexts');
        if (searchInput) {
            searchInput.value = filterConcept;
            // Disparar evento de busca
            searchInput.dispatchEvent(new Event('input'));
        }
        // Limpar filtro do localStorage
        localStorage.removeItem('filterConcept');
        
        // Scroll suave para os resultados
        setTimeout(() => {
            const textsList = document.getElementById('textsList');
            if (textsList) {
                textsList.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }

    // Verificar se usuário está autenticado
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    const authWarning = document.getElementById('authWarning');
    const newTextContainer = document.getElementById('newTextContainer');

    console.log('Auth check:', isLoggedIn);
    console.log('Elements:', { authWarning, newTextContainer });

    // Mostrar aviso se não estiver autenticado, ou botão se estiver
    if (!isLoggedIn && authWarning) {
        authWarning.style.display = 'block';
    }
    
    if (isLoggedIn && newTextContainer) {
        newTextContainer.style.display = 'block';
        console.log('Botão Novo Texto exibido');
    }

    // Busca de textos
    const searchInput = document.getElementById('searchTexts');
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    // Event listeners para filtros
    const filterArea = document.getElementById('filterArea');
    const filterType = document.getElementById('filterType');
    const filterConcepts = document.getElementById('filterConcepts');

    if (filterArea) filterArea.addEventListener('change', applyFilters);
    if (filterType) filterType.addEventListener('change', applyFilters);
    if (filterConcepts) filterConcepts.addEventListener('input', applyFilters);

    // Clique em tags/conceitos
    const conceptTags = document.querySelectorAll('#conceptTags .badge');
    conceptTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const concept = this.textContent;
            console.log('Filtrar por conceito:', concept);
            // Aqui seria a lógica de filtrar por conceito
        });
    });
}, 100);