// Text View Page JS

// Exemplo de dados do texto (normalmente viria do backend)
const textData = {
    metadata: {
        type: 'ensaio',
        objective: 'argumentar',
        foundationLevel: 'fundamentado'
    },
    authenticity: {
        isAuthor: true,
        hasInstitution: true,
        institution: 'Universidade de São Paulo',
        hasVerifiableClaims: true,
        sources: [
            'Santo Agostinho - Confissões, Livro XI',
            'Henri Bergson - Ensaio sobre os Dados Imediatos da Consciência',
            'Albert Einstein - Teoria da Relatividade Especial'
        ]
    },
    communityRatings: {
        count: 24,
        average: 8.2
    }
};

// Função para calcular nota de autenticidade (1-10)
function calculateAuthenticityScore(data) {
    let score = 0;
    
    // Critérios de autenticidade (peso: 4 pontos)
    if (data.authenticity.isAuthor) score += 1;
    if (data.authenticity.hasInstitution) score += 1.5;
    if (data.authenticity.hasVerifiableClaims) score += 1.5;
    
    // Quantidade de fontes (peso: 2 pontos)
    const sourcesCount = data.authenticity.sources?.length || 0;
    if (sourcesCount > 0) {
        score += Math.min(sourcesCount * 0.5, 2);
    }
    
    // Metadados preenchidos (peso: 2 pontos)
    if (data.metadata.type) score += 0.5;
    if (data.metadata.objective) score += 0.5;
    if (data.metadata.foundationLevel) score += 1;
    
    // Avaliação da comunidade (peso: 2 pontos)
    if (data.communityRatings && data.communityRatings.count > 0) {
        const communityScore = (data.communityRatings.average / 10) * 2;
        score += communityScore;
    }
    
    // Arredondar para 1 casa decimal
    return Math.min(Math.round(score * 10) / 10, 10);
}

// Função para obter descrição baseada na nota
function getScoreDescription(score) {
    if (score >= 9) return 'Texto altamente confiável e bem fundamentado';
    if (score >= 7.5) return 'Texto com boa fundamentação';
    if (score >= 6) return 'Texto com fundamentação moderada';
    if (score >= 4) return 'Texto com fundamentação limitada';
    return 'Texto com pouca fundamentação';
}

// Abrir modal de autenticidade
function openAuthenticityModal() {
    const modal = document.getElementById('authenticityModal');
    const score = calculateAuthenticityScore(textData);
    
    // Verificar se usuário está logado
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    const ratingFormContainer = document.getElementById('ratingFormContainer');
    const ratingLoginMessage = document.getElementById('ratingLoginMessage');
    
    if (ratingFormContainer && ratingLoginMessage) {
        if (isLoggedIn) {
            ratingFormContainer.style.display = 'block';
            ratingLoginMessage.style.display = 'none';
        } else {
            ratingFormContainer.style.display = 'none';
            ratingLoginMessage.style.display = 'block';
        }
    }
    
    // Atualizar nota
    document.getElementById('modalAuthScore').textContent = score.toFixed(1);
    document.getElementById('scoreDescription').innerHTML = '<strong>' + getScoreDescription(score) + '</strong>';
    
    // Atualizar metadados
    const metaTypeMap = {
        'ensaio': 'Ensaio',
        'artigo': 'Artigo',
        'opiniao': 'Opinião',
        'divulgacao': 'Divulgação'
    };
    const metaObjectiveMap = {
        'informar': 'Informar',
        'argumentar': 'Argumentar',
        'especular': 'Especular'
    };
    const metaFoundationMap = {
        'exploratório': 'Exploratório',
        'fundamentado': 'Fundamentado',
        'rigoroso': 'Rigoroso'
    };
    
    document.getElementById('metaType').textContent = metaTypeMap[textData.metadata.type] || 'Não especificado';
    document.getElementById('metaObjective').textContent = metaObjectiveMap[textData.metadata.objective] || 'Não especificado';
    document.getElementById('metaFoundation').textContent = metaFoundationMap[textData.metadata.foundationLevel] || 'Não especificado';
    
    // Atualizar critérios
    updateCriteriaItem('criteriaAuthor', textData.authenticity.isAuthor, 'Autor declarado');
    updateCriteriaItem('criteriaInstitution', textData.authenticity.hasInstitution, 
        'Vínculo institucional: <strong>' + (textData.authenticity.institution || 'Não especificado') + '</strong>');
    updateCriteriaItem('criteriaSources', textData.authenticity.hasVerifiableClaims, 
        'Fontes verificáveis (<span id="sourcesCount">' + (textData.authenticity.sources?.length || 0) + '</span>)');
    
    // Atualizar fontes
    const sourcesList = document.getElementById('sourcesList');
    if (textData.authenticity.sources && textData.authenticity.sources.length > 0) {
        sourcesList.innerHTML = textData.authenticity.sources
            .map((source, index) => `<div class="source-item">${index + 1}. ${source}</div>`)
            .join('');
        document.getElementById('sourcesSection').style.display = 'block';
    } else {
        document.getElementById('sourcesSection').style.display = 'none';
    }
    
    // Atualizar estatísticas da comunidade
    document.getElementById('ratingsCount').textContent = textData.communityRatings.count;
    document.getElementById('communityAverage').textContent = textData.communityRatings.average.toFixed(1);
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Fechar modal
function closeAuthenticityModal() {
    const modal = document.getElementById('authenticityModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Atualizar item de critério
function updateCriteriaItem(elementId, isActive, text) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    if (isActive) {
        element.classList.remove('inactive');
        element.querySelector('.criteria-text').innerHTML = text;
    } else {
        element.classList.add('inactive');
        element.querySelector('.criteria-icon').textContent = '✗';
        element.querySelector('.criteria-text').innerHTML = text.replace(/<strong>.*<\/strong>/, 'Não informado');
    }
}

// Atualizar valor do slider
const ratingSlider = document.getElementById('userRating');
const ratingValue = document.getElementById('ratingValue');

if (ratingSlider && ratingValue) {
    ratingSlider.addEventListener('input', function() {
        ratingValue.textContent = parseFloat(this.value).toFixed(1);
    });
}

// Enviar avaliação
function submitRating() {
    const rating = parseFloat(document.getElementById('userRating').value);
    const comment = document.getElementById('ratingComment').value.trim();
    const commentError = document.getElementById('commentError');
    const commentTextarea = document.getElementById('ratingComment');
    
    // Validar comentário
    if (comment.length < 20) {
        commentError.style.display = 'block';
        commentTextarea.style.borderColor = '#ff6b6b';
        commentTextarea.focus();
        return;
    }
    
    // Limpar erros
    commentError.style.display = 'none';
    commentTextarea.style.borderColor = '#404040';
    
    // Aqui seria a chamada ao backend para salvar a avaliação
    console.log('Avaliação enviada:', { rating, comment });
    
    // Simular atualização da média
    const newCount = textData.communityRatings.count + 1;
    const newAverage = ((textData.communityRatings.average * textData.communityRatings.count) + rating) / newCount;
    
    textData.communityRatings.count = newCount;
    textData.communityRatings.average = newAverage;
    
    // Atualizar display
    document.getElementById('ratingsCount').textContent = newCount;
    document.getElementById('communityAverage').textContent = newAverage.toFixed(1);
    
    // Recalcular e atualizar nota geral
    const newScore = calculateAuthenticityScore(textData);
    document.getElementById('modalAuthScore').textContent = newScore.toFixed(1);
    document.getElementById('authenticityScore').textContent = newScore.toFixed(1);
    document.getElementById('scoreDescription').innerHTML = '<strong>' + getScoreDescription(newScore) + '</strong>';
    
    // Limpar formulário
    document.getElementById('ratingComment').value = '';
    document.getElementById('userRating').value = 8;
    document.getElementById('ratingValue').textContent = '8.0';
    
    alert('Obrigado por avaliar este texto!');
}

// Tornar funções globais
window.openAuthenticityModal = openAuthenticityModal;
window.closeAuthenticityModal = closeAuthenticityModal;
window.submitRating = submitRating;

// Função para filtrar textos por conceito
function filterByConcept(concept) {
    // Armazenar conceito selecionado no localStorage
    localStorage.setItem('filterConcept', concept);
    // Navegar para página de textos
    window.location.hash = 'texts';
}

window.filterByConcept = filterByConcept;

// Verificar autenticação para adicionar dúvidas
function handleAddQuestion() {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    
    if (!isLoggedIn) {
        alert('Você precisa fazer login para adicionar dúvidas.');
        window.location.hash = 'login';
        return;
    }
    
    // Redirecionar para página de adicionar dúvida
    window.location.hash = 'add-question';
}

// Tornar função global
window.handleAddQuestion = handleAddQuestion;

// Carregar dados do texto (simulado - no futuro virá de API/backend)
function loadTextData() {
    // TODO: Implementar carregamento dinâmico baseado em ID do texto
    // Por enquanto usa dados estáticos do HTML
    console.log('Texto carregado');
}

// Inicialização com setTimeout para SPA
setTimeout(() => {
    // Calcular e exibir nota inicial
    const initialScore = calculateAuthenticityScore(textData);
    const scoreElement = document.getElementById('authenticityScore');
    if (scoreElement) {
        scoreElement.textContent = initialScore.toFixed(1);
    }
    
    // Verificar se usuário está logado e mostrar botão de adicionar dúvida
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    const btnAddQuestion = document.getElementById('btnAddQuestion');
    
    console.log('Text-view - Auth check:', isLoggedIn);
    console.log('Text-view - Button element:', btnAddQuestion);
    
    if (isLoggedIn && btnAddQuestion) {
        btnAddQuestion.style.display = 'inline-block';
        console.log('Botão Adicionar Dúvida exibido');
    }
    
    loadTextData();
}, 100);
