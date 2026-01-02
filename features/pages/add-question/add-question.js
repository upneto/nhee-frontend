// Add Question Page JS

const form = document.getElementById('addQuestionForm');
const questionContent = document.getElementById('questionContent');
const charCount = document.getElementById('questionCharCount');
const successMessage = document.getElementById('successMessage');

// Contador de caracteres
if (questionContent && charCount) {
    questionContent.addEventListener('input', function() {
        charCount.textContent = this.value.length;
    });
}

// Validação e submissão do formulário
if (form) {
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Resetar estados de validação
        const inputs = form.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.classList.remove('is-invalid', 'is-valid');
        });
        
        let isValid = true;
        
        // Validar título
        const title = document.getElementById('questionTitle');
        if (title.value.trim().length < 10 || title.value.trim().length > 150) {
            title.classList.add('is-invalid');
            isValid = false;
        } else {
            title.classList.add('is-valid');
        }
        
        // Validar conteúdo
        const content = document.getElementById('questionContent');
        if (content.value.trim().length < 50) {
            content.classList.add('is-invalid');
            isValid = false;
        } else {
            content.classList.add('is-valid');
        }
        
        // Validar tipo de contribuição
        const type = document.getElementById('contributionType');
        if (!type.value) {
            type.classList.add('is-invalid');
            isValid = false;
        } else {
            type.classList.add('is-valid');
        }
        
        // Se formulário válido, processar
        if (isValid) {
            submitQuestion();
        } else {
            // Scroll para o primeiro campo inválido
            const firstInvalid = form.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalid.focus();
            }
        }
    });
}

function submitQuestion() {
    // Coletar dados do formulário
    const questionData = {
        title: document.getElementById('questionTitle').value.trim(),
        content: document.getElementById('questionContent').value.trim(),
        type: document.getElementById('contributionType').value,
        author: localStorage.getItem('username') || 'Anônimo',
        date: new Date().toISOString(),
        textId: getTextIdFromUrl() // Pegar ID do texto da URL
    };
    
    console.log('Dados da dúvida:', questionData);
    
    // TODO: Aqui será implementada a chamada ao backend
    // Por enquanto, simular sucesso
    
    // Ocultar formulário e mostrar mensagem de sucesso
    form.style.display = 'none';
    successMessage.style.display = 'block';
    
    // Scroll para mensagem de sucesso
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Limpar formulário
    setTimeout(() => {
        form.reset();
        const inputs = form.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.classList.remove('is-invalid', 'is-valid');
        });
        if (charCount) charCount.textContent = '0';
    }, 100);
}

// Função para obter ID do texto da URL (se implementado com parâmetros)
function getTextIdFromUrl() {
    // TODO: Implementar quando houver sistema de rotas com parâmetros
    // Por enquanto retornar um ID de exemplo
    return localStorage.getItem('currentTextId') || '1';
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se usuário está logado
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    
    if (!isLoggedIn) {
        alert('Você precisa fazer login para adicionar dúvidas ou comentários.');
        window.location.hash = 'login';
    }
});
