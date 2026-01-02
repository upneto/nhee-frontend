// Edit Text Page JS
console.log('Edit Text page loaded');

// Carregar dados do texto a ser editado
setTimeout(() => {
    const textId = localStorage.getItem('editingTextId');
    
    if (!textId) {
        alert('Nenhum texto selecionado para edição.');
        window.location.hash = 'my-texts';
        return;
    }
    
    console.log('Carregando texto ID:', textId);
    
    // TODO: Buscar dados reais do backend
    // Por enquanto usa dados mockados
    const mockTexts = {
        '1': {
            title: 'Sobre a Natureza do Tempo',
            content: 'O tempo não é uma entidade externa que flui independentemente de nossa experiência. Ele emerge da relação entre consciência e mudança, sendo inseparável da percepção que temos dos eventos. Quando analisamos fenômenos temporais, não estamos lidando com uma dimensão objetiva e absoluta, mas com uma construção experiencial que varia conforme o observador e seu estado de consciência.\n\nA física moderna, especialmente a teoria da relatividade, já nos mostrou que o tempo não é uniforme e absoluto. Ele se dilata ou contrai dependendo da velocidade e da gravidade. Mas isso é apenas o aspecto físico. Do ponto de vista fenomenológico, o tempo é ainda mais complexo: é vivenciado, sentido, e sua passagem depende da intensidade de nossa atenção e engajamento com o presente.',
            tags: 'Tempo, Consciência, Metafísica',
            category: 'metafisica',
            customCategory: '',
            type: 'ensaio',
            objective: 'especular',
            foundationLevel: 'fundamentado',
            isAuthor: true,
            hasInstitution: false,
            institutionName: '',
            hasVerifiableClaims: true,
            sources: [
                'HUSSERL, Edmund. A Ideia da Fenomenologia. Lisboa: Edições 70, 1990.',
                'EINSTEIN, Albert. Sobre a Teoria da Relatividade Especial e Geral. Rio de Janeiro: Contraponto, 1999.'
            ]
        },
        '2': {
            title: 'Epistemologia e Justificação',
            content: 'A justificação epistêmica não pode ser reduzida a mera crença verdadeira. É necessário compreender os fundamentos que tornam uma crença justificada, e esses fundamentos variam conforme a teoria epistemológica adotada...',
            tags: 'Epistemologia, Conhecimento, Justificação',
            category: 'epistemologia',
            customCategory: '',
            type: 'artigo',
            objective: 'argumentar',
            foundationLevel: 'rigoroso',
            isAuthor: true,
            hasInstitution: true,
            institutionName: 'Universidade Federal de São Paulo',
            hasVerifiableClaims: true,
            sources: [
                'GETTIER, Edmund. Is Justified True Belief Knowledge? Analysis, 1963.'
            ]
        },
        '3': {
            title: 'Ética das Virtudes em Aristóteles',
            content: 'A ética aristotélica centra-se no conceito de virtude como meio-termo. A eudaimonia, traduzida como felicidade ou florescimento humano, é o fim último da vida humana...',
            tags: 'Ética, Aristóteles, Virtude',
            category: 'etica',
            customCategory: '',
            type: 'ensaio',
            objective: 'informar',
            foundationLevel: 'fundamentado',
            isAuthor: true,
            hasInstitution: false,
            institutionName: '',
            hasVerifiableClaims: true,
            sources: [
                'ARISTÓTELES. Ética a Nicômaco. São Paulo: Editora 34, 2009.'
            ]
        }
    };
    
    const textData = mockTexts[textId];
    
    if (!textData) {
        alert('Texto não encontrado.');
        window.location.hash = 'my-texts';
        return;
    }
    
    // Preencher campos do formulário
    document.getElementById('textTitle').value = textData.title;
    document.getElementById('textContent').value = textData.content;
    document.getElementById('textTags').value = textData.tags;
    document.getElementById('textCategory').value = textData.category;
    
    if (textData.category === 'outras' && textData.customCategory) {
        document.getElementById('customCategoryContainer').style.display = 'block';
        document.getElementById('customCategory').value = textData.customCategory;
    }
    
    if (textData.type) {
        document.getElementById('textType').value = textData.type;
    }
    
    if (textData.objective) {
        document.getElementById('textObjective').value = textData.objective;
    }
    
    if (textData.foundationLevel) {
        document.getElementById('foundationLevel').value = textData.foundationLevel;
    }
    
    // Checkboxes de autenticidade
    document.getElementById('authIsAuthor').checked = textData.isAuthor;
    document.getElementById('authInstitutional').checked = textData.hasInstitution;
    
    if (textData.hasInstitution) {
        document.getElementById('institutionContainer').style.display = 'block';
        document.getElementById('institutionName').value = textData.institutionName;
    }
    
    document.getElementById('hasVerifiableClaims').checked = textData.hasVerifiableClaims;
    
    if (textData.hasVerifiableClaims && textData.sources && textData.sources.length > 0) {
        document.getElementById('sourcesContainer').style.display = 'block';
        const sourcesList = document.getElementById('sourcesList');
        sourcesList.innerHTML = '';
        
        textData.sources.forEach((source, index) => {
            const sourceDiv = document.createElement('div');
            sourceDiv.className = 'input-group mb-2';
            sourceDiv.innerHTML = `
                <input type="text" class="form-control source-input" value="${source}" placeholder="Digite a fonte (URL, livro, artigo, etc.)">
                <button class="btn btn-outline-danger" type="button" onclick="removeSource(this)" ${index === 0 ? 'style="display: none;"' : ''}>
                    <i class="bi bi-trash"></i> Remover
                </button>
            `;
            sourcesList.appendChild(sourceDiv);
        });
    }
    
    // Atualizar contador de caracteres
    updateCharCount();
    
    console.log('Dados do texto carregados com sucesso');
}, 100);

// Contador de caracteres
const textContent = document.getElementById('textContent');
const charCount = document.getElementById('charCount');

function updateCharCount() {
    const content = document.getElementById('textContent');
    const counter = document.getElementById('charCount');
    if (content && counter) {
        counter.textContent = content.value.length;
    }
}

if (textContent && charCount) {
    textContent.addEventListener('input', updateCharCount);
}

// Mostrar/Ocultar campo de categoria customizada
const categorySelect = document.getElementById('textCategory');
const customCategoryContainer = document.getElementById('customCategoryContainer');

if (categorySelect) {
    categorySelect.addEventListener('change', function() {
        if (this.value === 'outras') {
            customCategoryContainer.style.display = 'block';
        } else {
            customCategoryContainer.style.display = 'none';
        }
    });
}

// Mostrar/Ocultar campo de instituição
const authInstitutional = document.getElementById('authInstitutional');
const institutionContainer = document.getElementById('institutionContainer');

if (authInstitutional) {
    authInstitutional.addEventListener('change', function() {
        if (this.checked) {
            institutionContainer.style.display = 'block';
        } else {
            institutionContainer.style.display = 'none';
        }
    });
}

// Mostrar/Ocultar container de fontes
const hasVerifiableClaims = document.getElementById('hasVerifiableClaims');
const sourcesContainer = document.getElementById('sourcesContainer');

if (hasVerifiableClaims) {
    hasVerifiableClaims.addEventListener('change', function() {
        if (this.checked) {
            sourcesContainer.style.display = 'block';
        } else {
            sourcesContainer.style.display = 'none';
        }
    });
}

// Adicionar fonte
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
}

// Remover fonte
function removeSource(button) {
    const sourceGroup = button.parentElement;
    sourceGroup.remove();
}

// Tornar funções globais
window.addSource = addSource;
window.removeSource = removeSource;

// Validação e envio do formulário
const editForm = document.getElementById('editTextForm');
if (editForm) {
    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar formulário
        if (!editForm.checkValidity()) {
            editForm.classList.add('was-validated');
            alert('Por favor, preencha todos os campos obrigatórios corretamente.');
            return;
        }
        
        // Coletar dados do formulário
        const formData = {
            textId: localStorage.getItem('editingTextId'),
            title: document.getElementById('textTitle').value,
            content: document.getElementById('textContent').value,
            tags: document.getElementById('textTags').value,
            category: document.getElementById('textCategory').value,
            customCategory: document.getElementById('customCategory').value,
            type: document.getElementById('textType').value,
            objective: document.getElementById('textObjective').value,
            foundationLevel: document.getElementById('foundationLevel').value,
            isAuthor: document.getElementById('authIsAuthor').checked,
            hasInstitution: document.getElementById('authInstitutional').checked,
            institutionName: document.getElementById('institutionName').value,
            hasVerifiableClaims: document.getElementById('hasVerifiableClaims').checked,
            sources: []
        };
        
        // Coletar fontes
        const sourceInputs = document.querySelectorAll('.source-input');
        sourceInputs.forEach(input => {
            if (input.value.trim()) {
                formData.sources.push(input.value.trim());
            }
        });
        
        console.log('Atualizando texto:', formData);
        
        // TODO: Enviar para backend
        // Por enquanto apenas simula sucesso
        
        // Ocultar formulário e mostrar mensagem de sucesso
        editForm.style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        
        // Limpar ID de edição do localStorage
        setTimeout(() => {
            localStorage.removeItem('editingTextId');
        }, 100);
    });
}
