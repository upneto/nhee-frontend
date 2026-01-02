// My Texts Page JS
console.log('My Texts page loaded');

// Função para editar texto
function editText(textId) {
    console.log('Editing text:', textId);
    
    // Salvar ID do texto no localStorage para carregar na página de edição
    localStorage.setItem('editingTextId', textId);
    
    // Redirecionar para página de edição
    window.location.hash = 'edit-text';
}

// Função para excluir texto
function deleteText(textId) {
    if (confirm('Tem certeza que deseja excluir este texto? Esta ação não pode ser desfeita.')) {
        console.log('Deleting text:', textId);
        
        // TODO: Implementar exclusão real com backend
        // Por enquanto, apenas remove visualmente
        const textCard = document.querySelector(`[data-text-id="${textId}"]`);
        if (textCard) {
            textCard.style.opacity = '0';
            textCard.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                textCard.remove();
                
                // Verificar se ainda há textos
                const remainingTexts = document.querySelectorAll('.my-text-card');
                if (remainingTexts.length === 0) {
                    document.getElementById('myTextsList').style.display = 'none';
                    document.getElementById('noTextsMessage').style.display = 'block';
                }
            }, 300);
        }
        
        alert('Texto excluído com sucesso!');
    }
}

// Tornar funções globais
window.editText = editText;
window.deleteText = deleteText;

// Carregar lista de textos
setTimeout(() => {
    // TODO: Carregar textos reais do backend
    // Por enquanto usa dados estáticos do HTML
    
    console.log('Textos carregados');
}, 100);
