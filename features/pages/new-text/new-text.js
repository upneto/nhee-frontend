// New Text Page JS

const form = document.getElementById('newTextForm');
const textContent = document.getElementById('textContent');
const charCount = document.getElementById('charCount');
const successMessage = document.getElementById('successMessage');
const categorySelect = document.getElementById('textCategory');
const customCategoryContainer = document.getElementById('customCategoryContainer');
const customCategoryInput = document.getElementById('customCategory');

// Contador de caracteres
if (textContent && charCount) {
    textContent.addEventListener('input', function() {
        charCount.textContent = this.value.length;
    });
}

// Mostrar/ocultar campo de categoria customizada
if (categorySelect && customCategoryContainer) {
    categorySelect.addEventListener('change', function() {
        if (this.value === 'outras') {
            customCategoryContainer.style.display = 'block';
            customCategoryInput.required = true;
        } else {
            customCategoryContainer.style.display = 'none';
            customCategoryInput.required = false;
            customCategoryInput.value = '';
            customCategoryInput.classList.remove('is-invalid', 'is-valid');
        }
    });
}

// Mostrar/ocultar campo de instituição
const authInstitutional = document.getElementById('authInstitutional');
const institutionContainer = document.getElementById('institutionContainer');
if (authInstitutional && institutionContainer) {
    authInstitutional.addEventListener('change', function() {
        institutionContainer.style.display = this.checked ? 'block' : 'none';
        if (!this.checked) {
            document.getElementById('institutionName').value = '';
        }
    });
}

// Mostrar/ocultar container de fontes
const hasVerifiableClaims = document.getElementById('hasVerifiableClaims');
const sourcesContainer = document.getElementById('sourcesContainer');
if (hasVerifiableClaims && sourcesContainer) {
    hasVerifiableClaims.addEventListener('change', function() {
        sourcesContainer.style.display = this.checked ? 'block' : 'none';
    });
}

// Função para adicionar nova fonte
function addSource() {
    const sourcesList = document.getElementById('sourcesList');
    const newSource = document.createElement('div');
    newSource.className = 'input-group mb-2';
    newSource.innerHTML = `
        <input type="text" class="form-control source-input" placeholder="Digite a fonte (URL, livro, artigo, etc.)">
        <button class="btn btn-outline-danger" type="button" onclick="removeSource(this)">
            <i class="bi bi-trash"></i> Remover
        </button>
    `;
    sourcesList.appendChild(newSource);
    
    // Mostrar botão remover no primeiro input se houver mais de um
    updateRemoveButtons();
}

// Função para remover fonte
function removeSource(button) {
    button.closest('.input-group').remove();
    updateRemoveButtons();
}

// Atualizar visibilidade dos botões remover
function updateRemoveButtons() {
    const sourceInputs = document.querySelectorAll('#sourcesList .input-group');
    sourceInputs.forEach((group, index) => {
        const removeBtn = group.querySelector('.btn-outline-danger');
        if (removeBtn) {
            removeBtn.style.display = sourceInputs.length > 1 ? 'inline-block' : 'none';
        }
    });
}

// Tornar funções globais
window.addSource = addSource;
window.removeSource = removeSource;

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
        const title = document.getElementById('textTitle');
        if (title.value.trim().length < 10 || title.value.trim().length > 150) {
            title.classList.add('is-invalid');
            isValid = false;
        } else {
            title.classList.add('is-valid');
        }
        
        // Validar conteúdo
        const content = document.getElementById('textContent');
        if (content.value.trim().length < 200) {
            content.classList.add('is-invalid');
            isValid = false;
        } else {
            content.classList.add('is-valid');
        }
        
        // Validar categoria
        const category = document.getElementById('textCategory');
        if (!category.value) {
            category.classList.add('is-invalid');
            isValid = false;
        } else {
            category.classList.add('is-valid');
            
            // Se "Outras" foi selecionado, validar campo customizado
            if (category.value === 'outras') {
                const customCategory = document.getElementById('customCategory');
                if (!customCategory.value.trim() || customCategory.value.trim().length < 3) {
                    customCategory.classList.add('is-invalid');
                    isValid = false;
                } else {
                    customCategory.classList.add('is-valid');
                }
            }
        }
        
        // Se formulário válido, processar
        if (isValid) {
            submitText();
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

function submitText() {
    // Coletar dados do formulário
    const categoryValue = document.getElementById('textCategory').value;
    const finalCategory = categoryValue === 'outras' 
        ? document.getElementById('customCategory').value.trim() 
        : categoryValue;
    
    // Coletar metadados do texto
    const textType = document.getElementById('textType').value;
    const textObjective = document.getElementById('textObjective').value;
    const foundationLevel = document.getElementById('foundationLevel').value;
    
    // Coletar critérios de autenticidade
    const isAuthor = document.getElementById('authIsAuthor').checked;
    const hasInstitution = document.getElementById('authInstitutional').checked;
    const institutionName = hasInstitution ? document.getElementById('institutionName').value.trim() : '';
    
    // Coletar fontes
    const hasVerifiable = document.getElementById('hasVerifiableClaims').checked;
    const sources = [];
    if (hasVerifiable) {
        document.querySelectorAll('.source-input').forEach(input => {
            if (input.value.trim()) {
                sources.push(input.value.trim());
            }
        });
    }
    
    const textData = {
        title: document.getElementById('textTitle').value.trim(),
        content: document.getElementById('textContent').value.trim(),
        tags: document.getElementById('textTags').value.trim(),
        category: finalCategory,
        author: localStorage.getItem('username') || 'Anônimo',
        date: new Date().toISOString(),
        metadata: {
            type: textType,
            objective: textObjective,
            foundationLevel: foundationLevel
        },
        authenticity: {
            isAuthor: isAuthor,
            hasInstitution: hasInstitution,
            institution: institutionName,
            hasVerifiableClaims: hasVerifiable,
            sources: sources
        }
    };
    
    console.log('Dados do texto:', textData);
    
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

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se usuário está logado
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    
    if (!isLoggedIn) {
        alert('Você precisa fazer login para criar um novo texto.');
        window.location.hash = 'login';
    }
});
