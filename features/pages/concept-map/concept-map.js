// Concept Map Page JS
console.log('Concept Map page loaded');

// Dados do grafo (simulação - será substituído por dados reais do backend)
const graphData = {
    nodes: [
        // Textos
        { id: 'text1', label: 'Sobre a\nNatureza do Tempo', type: 'text', x: 200, y: 100 },
        { id: 'text2', label: 'Epistemologia e\nJustificação', type: 'text', x: 600, y: 100 },
        
        // Conceitos
        { id: 'concept1', label: 'Tempo', type: 'concept', x: 200, y: 250 },
        { id: 'concept2', label: 'Consciência', type: 'concept', x: 350, y: 250 },
        { id: 'concept3', label: 'Conhecimento', type: 'concept', x: 600, y: 250 },
        { id: 'concept4', label: 'Justificação', type: 'concept', x: 750, y: 250 },
        
        // Dúvidas
        { id: 'question1', label: 'Como o tempo\nrelaciona-se com\nconsciência?', type: 'question', x: 275, y: 400 },
        { id: 'question2', label: 'O que torna\numa crença\njustificada?', type: 'question', x: 675, y: 400 },
        
        // Respostas
        { id: 'answer1', label: 'Tempo emerge\nda percepção', type: 'answer', x: 275, y: 550 },
        { id: 'answer2', label: 'Fundamentação\nepistêmica', type: 'answer', x: 675, y: 550 }
    ],
    edges: [
        // Texto -> Conceito
        { source: 'text1', target: 'concept1', label: 'aborda' },
        { source: 'text1', target: 'concept2', label: 'aborda' },
        { source: 'text2', target: 'concept3', label: 'aborda' },
        { source: 'text2', target: 'concept4', label: 'aborda' },
        
        // Conceito -> Dúvida
        { source: 'concept1', target: 'question1', label: 'gera' },
        { source: 'concept2', target: 'question1', label: 'gera' },
        { source: 'concept3', target: 'question2', label: 'gera' },
        { source: 'concept4', target: 'question2', label: 'gera' },
        
        // Dúvida -> Resposta
        { source: 'question1', target: 'answer1', label: 'respondida por' },
        { source: 'question2', target: 'answer2', label: 'respondida por' }
    ]
};

// Configurações visuais por tipo de nó
const nodeStyles = {
    text: { color: '#3498db', stroke: '#5dade2', radius: 40 },
    concept: { color: '#d4af37', stroke: '#f5d76e', radius: 35 },
    question: { color: '#e74c3c', stroke: '#ec7063', radius: 45 },
    answer: { color: '#27ae60', stroke: '#58d68d', radius: 35 }
};

// Variáveis globais
let currentZoom = 1;
let selectedNode = null;

// Inicializar grafo
setTimeout(() => {
    renderGraph();
    setupEventListeners();
}, 100);

// Renderizar o grafo
function renderGraph() {
    const svg = document.getElementById('graphSvg');
    const edgesGroup = document.getElementById('edgesGroup');
    const nodesGroup = document.getElementById('nodesGroup');
    
    // Limpar conteúdo anterior
    edgesGroup.innerHTML = '';
    nodesGroup.innerHTML = '';
    
    // Renderizar arestas
    graphData.edges.forEach((edge, index) => {
        const sourceNode = graphData.nodes.find(n => n.id === edge.source);
        const targetNode = graphData.nodes.find(n => n.id === edge.target);
        
        if (sourceNode && targetNode) {
            // Calcular ponto médio para o label
            const midX = (sourceNode.x + targetNode.x) / 2;
            const midY = (sourceNode.y + targetNode.y) / 2;
            
            // Criar linha
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const d = `M ${sourceNode.x} ${sourceNode.y} L ${targetNode.x} ${targetNode.y}`;
            line.setAttribute('d', d);
            line.setAttribute('class', 'graph-edge');
            line.setAttribute('marker-end', 'url(#arrowhead)');
            line.setAttribute('data-source', edge.source);
            line.setAttribute('data-target', edge.target);
            edgesGroup.appendChild(line);
            
            // Criar label da aresta
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', midX);
            label.setAttribute('y', midY - 5);
            label.setAttribute('class', 'edge-label');
            label.textContent = edge.label;
            edgesGroup.appendChild(label);
        }
    });
    
    // Renderizar nós
    graphData.nodes.forEach(node => {
        const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        nodeGroup.setAttribute('class', 'graph-node');
        nodeGroup.setAttribute('data-id', node.id);
        nodeGroup.setAttribute('data-type', node.type);
        nodeGroup.setAttribute('transform', `translate(${node.x}, ${node.y})`);
        
        const style = nodeStyles[node.type];
        
        // Criar círculo do nó
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', style.radius);
        circle.setAttribute('fill', style.color);
        circle.setAttribute('stroke', style.stroke);
        circle.setAttribute('stroke-width', 2);
        nodeGroup.appendChild(circle);
        
        // Criar texto (label com múltiplas linhas)
        const lines = node.label.split('\n');
        lines.forEach((line, i) => {
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('dy', `${(i - lines.length / 2 + 0.5) * 14}`);
            text.textContent = line;
            nodeGroup.appendChild(text);
        });
        
        // Event listeners
        nodeGroup.addEventListener('click', () => selectNode(node));
        nodeGroup.addEventListener('mouseenter', () => highlightConnections(node.id));
        nodeGroup.addEventListener('mouseleave', () => clearHighlights());
        
        nodesGroup.appendChild(nodeGroup);
    });
}

// Selecionar nó e mostrar detalhes
function selectNode(node) {
    selectedNode = node;
    
    // Remover seleção anterior
    document.querySelectorAll('.graph-node.selected').forEach(n => {
        n.classList.remove('selected');
    });
    
    // Adicionar seleção atual
    const nodeElement = document.querySelector(`.graph-node[data-id="${node.id}"]`);
    if (nodeElement) {
        nodeElement.classList.add('selected');
    }
    
    // Mostrar painel de detalhes
    showDetails(node);
}

// Mostrar detalhes do nó selecionado
function showDetails(node) {
    const detailsPanel = document.getElementById('detailsPanel');
    const detailsTitle = document.getElementById('detailsTitle');
    const detailsContent = document.getElementById('detailsContent');
    
    detailsTitle.textContent = node.label.replace(/\n/g, ' ');
    
    // Encontrar conexões
    const outgoing = graphData.edges.filter(e => e.source === node.id);
    const incoming = graphData.edges.filter(e => e.target === node.id);
    
    let html = `
        <div class="detail-item">
            <div class="detail-label">Tipo</div>
            <div class="detail-value">${getTypeLabel(node.type)}</div>
        </div>
    `;
    
    if (incoming.length > 0) {
        html += `
            <div class="detail-item">
                <div class="detail-label">Recebe de (${incoming.length})</div>
                <ul class="connection-list">
                    ${incoming.map(edge => {
                        const sourceNode = graphData.nodes.find(n => n.id === edge.source);
                        return `<li class="connection-item" onclick="selectNodeById('${edge.source}')">
                            ${sourceNode.label.replace(/\n/g, ' ')} <em>(${edge.label})</em>
                        </li>`;
                    }).join('')}
                </ul>
            </div>
        `;
    }
    
    if (outgoing.length > 0) {
        html += `
            <div class="detail-item">
                <div class="detail-label">Conecta com (${outgoing.length})</div>
                <ul class="connection-list">
                    ${outgoing.map(edge => {
                        const targetNode = graphData.nodes.find(n => n.id === edge.target);
                        return `<li class="connection-item" onclick="selectNodeById('${edge.target}')">
                            ${targetNode.label.replace(/\n/g, ' ')} <em>(${edge.label})</em>
                        </li>`;
                    }).join('')}
                </ul>
            </div>
        `;
    }
    
    detailsContent.innerHTML = html;
    detailsPanel.classList.add('open');
}

// Obter label do tipo
function getTypeLabel(type) {
    const labels = {
        text: '📝 Texto',
        concept: '💡 Conceito',
        question: '❓ Dúvida',
        answer: '✅ Resposta'
    };
    return labels[type] || type;
}

// Selecionar nó por ID
function selectNodeById(nodeId) {
    const node = graphData.nodes.find(n => n.id === nodeId);
    if (node) {
        selectNode(node);
    }
}

// Destacar conexões ao passar o mouse
function highlightConnections(nodeId) {
    const connectedEdges = graphData.edges.filter(e => 
        e.source === nodeId || e.target === nodeId
    );
    
    connectedEdges.forEach(edge => {
        const edgeElement = document.querySelector(
            `.graph-edge[data-source="${edge.source}"][data-target="${edge.target}"]`
        );
        if (edgeElement) {
            edgeElement.classList.add('highlighted');
        }
    });
}

// Limpar destaques
function clearHighlights() {
    document.querySelectorAll('.graph-edge.highlighted').forEach(edge => {
        edge.classList.remove('highlighted');
    });
}

// Fechar painel de detalhes
function closeDetails() {
    document.getElementById('detailsPanel').classList.remove('open');
    
    // Remover seleção
    document.querySelectorAll('.graph-node.selected').forEach(n => {
        n.classList.remove('selected');
    });
    selectedNode = null;
}

// Zoom in
function zoomIn() {
    currentZoom = Math.min(currentZoom + 0.1, 2);
    applyZoom();
}

// Zoom out
function zoomOut() {
    currentZoom = Math.max(currentZoom - 0.1, 0.5);
    applyZoom();
}

// Reset view
function resetView() {
    currentZoom = 1;
    applyZoom();
}

// Aplicar zoom
function applyZoom() {
    const graphGroup = document.getElementById('graphGroup');
    graphGroup.setAttribute('transform', `scale(${currentZoom})`);
}

// Configurar event listeners
function setupEventListeners() {
    // Filtros
    document.getElementById('filterType').addEventListener('change', function() {
        filterByType(this.value);
    });
    
    document.getElementById('filterConcept').addEventListener('change', function() {
        filterByConcept(this.value);
    });
    
    document.getElementById('layoutType').addEventListener('change', function() {
        changeLayout(this.value);
    });
}

// Filtrar por tipo
function filterByType(type) {
    const nodes = document.querySelectorAll('.graph-node');
    
    nodes.forEach(node => {
        const nodeType = node.getAttribute('data-type');
        
        if (type === 'all') {
            node.style.display = 'block';
        } else if (type === 'texts' && nodeType === 'text') {
            node.style.display = 'block';
        } else if (type === 'concepts' && nodeType === 'concept') {
            node.style.display = 'block';
        } else if (type === 'questions' && nodeType === 'question') {
            node.style.display = 'block';
        } else if (type === 'answers' && nodeType === 'answer') {
            node.style.display = 'block';
        } else {
            node.style.display = 'none';
        }
    });
}

// Filtrar por conceito (placeholder - será implementado com dados reais)
function filterByConcept(concept) {
    console.log('Filtrar por conceito:', concept);
    // TODO: Implementar filtro por conceito
}

// Mudar layout (placeholder - será implementado com biblioteca de grafo)
function changeLayout(layout) {
    console.log('Mudar layout:', layout);
    // TODO: Implementar diferentes layouts
}

// Tornar funções globais
window.selectNodeById = selectNodeById;
window.closeDetails = closeDetails;
window.zoomIn = zoomIn;
window.zoomOut = zoomOut;
window.resetView = resetView;
