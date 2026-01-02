# Nhe'ẽ porã - Regras do Sistema

## 1. VISÃO GERAL

**Nome:** Nhe'ẽ porã (guarani: "palavras belas/palavras verdadeiras")

**Propósito:** Plataforma colaborativa para compartilhamento e debate de textos científicos com foco em autenticidade e conhecimento fundamentado.

**Tecnologia:** SPA (Single Page Application) com HTML5, CSS3, JavaScript vanilla, Bootstrap 5 e Nginx.

---

## 2. AUTENTICAÇÃO E AUTORIZAÇÃO

### 2.1 Acesso Público
- **Permitido:**
  - Visualizar lista de textos
  - Ler textos completos
  - Ver dúvidas/comentários em textos
  - Visualizar o Mapa Conceitual
  - Acessar página "Sobre"
  - Acessar página "Contato"

### 2.2 Acesso Restrito (Requer Login)
- **Funcionalidades:**
  - Criar novo texto
  - Avaliar autenticidade de textos (nota 1-10)
  - Adicionar dúvidas/comentários em textos
  - Gerenciar conta pessoal
  - Visualizar e editar próprios textos
  - Excluir próprios textos

### 2.3 Sistema de Login
- **Armazenamento:** localStorage (simulação - substituir por backend real)
- **Campos:**
  - `loggedIn`: boolean
  - `username`: string
- **Validações:**
  - Email válido
  - Senha mínima de 6 caracteres
  - Nome completo mínimo de 3 caracteres

---

## 3. ESTRUTURA DE DADOS

### 3.1 Texto Científico
**Campos obrigatórios:**
- Título (10-150 caracteres)
- Conteúdo (mínimo 200 caracteres)
- Área do Conhecimento (categoria)

**Campos opcionais:**
- Tags/Conceitos (2-5 recomendados)
- Tipo de Texto (Ensaio, Artigo, Opinião, Divulgação)
- Objetivo Declarado (Informar, Argumentar, Especular)
- Grau de Fundamentação (Exploratório, Fundamentado, Rigoroso)

**Critérios de Autenticidade:**
- Autor identificado
- Vínculo institucional (opcional com especificação)
- Fontes verificáveis (lista de referências)

### 3.2 Áreas do Conhecimento
- Metafísica
- Epistemologia
- Ética
- Estética
- Lógica
- Filosofia Política
- Filosofia da Linguagem
- Filosofia da Ciência
- Fenomenologia
- Existencialismo
- Outras (campo customizado)

### 3.3 Dúvidas/Comentários
**Tipos de Contribuição:**
- Dúvida Filosófica (azul)
- Comentário Crítico (laranja)
- Contraponto Argumentativo (vermelho)
- Complemento ao Texto (verde)

**Campos:**
- Título (obrigatório, 10-150 caracteres)
- Conteúdo (obrigatório, mínimo 100 caracteres)
- Tipo de contribuição (obrigatório)

### 3.4 Autenticidade
**Sistema de Avaliação:**
- Escala: 1 a 10
- Apenas usuários logados podem avaliar
- Um popup modal para submissão da nota
- Média calculada e exibida nos cards de texto

---

## 4. NAVEGAÇÃO E ROTEAMENTO

### 4.1 Páginas Públicas
- `#home` - Página inicial
- `#about` - Sobre a plataforma
- `#contact` - Contato
- `#texts` - Lista de textos
- `#text-view` - Visualização de texto completo
- `#concept-map` - Mapa conceitual
- `#login` - Login
- `#register` - Cadastro
- `#forgot-password` - Recuperação de senha
- `#404` - Página não encontrada

### 4.2 Páginas Restritas (Login Obrigatório)
- `#new-text` - Criar novo texto
- `#add-question` - Adicionar dúvida/comentário
- `#my-account` - Gerenciar conta
- `#my-texts` - Meus textos
- `#edit-text` - Editar texto

### 4.3 Navegação Hash-Based
- Sistema SPA com hash routing (#page)
- Arrays de controle:
  - `publicPages` - páginas acessíveis sem login
  - `authRequiredPages` - páginas que exigem autenticação
- Redirecionamento automático para login se não autenticado

---

## 5. INTERFACE E DESIGN

### 5.1 Paleta de Cores
- **Background primário:** #0d0d0d (preto profundo)
- **Background secundário:** #1a1a1a (preto suave)
- **Dourado primário:** #d4af37 (ouro)
- **Dourado secundário:** #b8935e (bronze)
- **Dourado claro:** #f5d76e (ouro claro)
- **Texto primário:** #e8e8e8 (branco suave)
- **Texto secundário:** #999 (cinza)
- **Bordas:** #2d2d2d

### 5.2 Tipografia
- **Corpo:** 'Crimson Text', Georgia, serif (18px)
- **Títulos:** 'Cinzel', Georgia, serif
- **Line height:** 1.8 (para leitura confortável)

### 5.3 Componentes Visuais
**Botões:**
- Primário: Gradiente dourado (#d4af37 → #b8935e)
- Secundário: Fundo #2d2d2d com borda
- Hover: Elevação e mudança de cor

**Cards:**
- Background: Gradiente #1a1a1a → #0d0d0d
- Borda esquerda: 4px #d4af37
- Hover: Translação horizontal e sombra dourada

**Forms:**
- Background: #1a1a1a
- Bordas: #2d2d2d
- Focus: Borda #d4af37 com sombra

---

## 6. FUNCIONALIDADES ESPECÍFICAS

### 6.1 Dropdown "Minhas Reflexões"
- **Comportamento:** Click-based (não hover)
- **Itens:** Minha Conta, Meus Textos, Mapa Conceitual
- **Visibilidade:** Apenas para usuários autenticados
- **Fechamento:** Click fora do menu ou no toggle
- **Classe ativa:** `.active` para controle de estado

### 6.2 Sistema de Filtros (Página Textos)
**Filtros disponíveis:**
- Área do Conhecimento
- Tipo de Texto
- Conceitos (tags)

**Comportamento:**
- Filtros cumulativos
- Atualização em tempo real
- Reset para limpar filtros

### 6.3 Visibilidade de Botões (SPA Fix)
**Problema:** Botões desaparecendo na navegação SPA
**Solução:** `setTimeout(100ms)` antes de manipular DOM
**Implementação:**
```javascript
setTimeout(() => {
    // Manipulação do DOM aqui
}, 100);
```

**Funções globais:**
- `window.handleNewText`
- `window.handleAddQuestion`
- `window.editText`
- `window.deleteText`

### 6.4 Mapa Conceitual
**Tipos de Nós:**
- 🔵 Textos (azul #3498db, raio 40px)
- 🟡 Conceitos (dourado #d4af37, raio 35px)
- 🔴 Dúvidas (vermelho #e74c3c, raio 45px)
- 🟢 Respostas (verde #27ae60, raio 35px)

**Relacionamentos:**
- Texto → Conceito (aborda)
- Conceito → Dúvida (gera)
- Dúvida → Resposta (respondida por)
- Resposta → Conceito (cria novos)

**Controles:**
- Zoom +/- (dourado)
- Reset (vermelho)
- Filtros por tipo
- Filtros por conceito
- Layouts: Hierárquico, Radial, Força

**Interatividade:**
- Click em nó: abre painel lateral de detalhes
- Hover em nó: destaca conexões
- Navegação entre nós conectados

---

## 7. VALIDAÇÕES E REGRAS DE NEGÓCIO

### 7.1 Validação de Formulários
**Texto:**
- Título: 10-150 caracteres
- Conteúdo: mínimo 200 caracteres
- Categoria: obrigatória
- Se categoria "Outras": campo customizado obrigatório

**Dúvida/Comentário:**
- Título: 10-150 caracteres
- Conteúdo: mínimo 100 caracteres
- Tipo: obrigatório

**Conta:**
- Email: formato válido
- Nome: mínimo 3 caracteres
- Senha: mínimo 6 caracteres
- Confirmação de senha: deve coincidir
- Biografia: máximo 500 caracteres

### 7.2 Fontes Verificáveis
- Campo dinâmico: adicionar/remover fontes
- Primeira fonte: botão remover oculto
- Adicionar fonte cria novo campo
- Validação: pelo menos uma fonte se checkbox marcado

### 7.3 Autenticidade
- Modal exibido ao clicar no badge de autenticidade
- Apenas usuários logados podem avaliar
- Formulário de avaliação com escala 1-10
- Média calculada e exibida

---

## 8. ESTADO E PERSISTÊNCIA

### 8.1 localStorage (Temporário)
**Chaves utilizadas:**
- `loggedIn` - status de autenticação
- `username` - nome do usuário
- `editingTextId` - ID do texto sendo editado

### 8.2 Transição para Backend
**A implementar:**
- API REST para CRUD de textos
- Sistema de autenticação JWT
- Banco de dados para persistência
- Upload de imagens
- Sistema de notificações

---

## 9. RESPONSIVIDADE

### 9.1 Breakpoints
- Desktop: > 768px
- Mobile: ≤ 768px

### 9.2 Adaptações Mobile
- Menu dropdown: width 90%
- Grid: colunas empilhadas
- Botões: largura total
- Painel de detalhes (mapa): 90% da tela
- Font-size reduzido em títulos

---

## 10. ANIMAÇÕES E TRANSIÇÕES

### 10.1 Animações Padrão
**fadeIn:**
```css
from { opacity: 0; transform: translateY(30px); }
to { opacity: 1; transform: translateY(0); }
```
- Duração: 0.8s
- Timing: ease-in

### 10.2 Transições
- Botões: 0.3s all ease
- Cards: 0.3s all ease
- Dropdown: 0.3s opacity
- Painel lateral: 0.4s right ease

### 10.3 Efeitos Hover
- Elevação (translateY)
- Mudança de cor
- Sombra dourada
- Borda destacada

---

## 11. ACESSIBILIDADE

### 11.1 Implementações
- Labels em todos os campos de formulário
- Feedback visual em validações
- Contraste adequado (WCAG AA)
- Textos descritivos em links
- Alt text em imagens

### 11.2 Navegação por Teclado
- Tab navigation em formulários
- Enter para submit
- Escape para fechar modais (a implementar)

---

## 12. SEGURANÇA

### 12.1 Validações Client-Side
- Sanitização de inputs
- Validação de tipos
- Limites de caracteres
- Formato de email

### 12.2 A Implementar (Backend)
- CSRF protection
- XSS prevention
- SQL injection prevention
- Rate limiting
- Autenticação JWT
- HTTPS obrigatório

---

## 13. PERFORMANCE

### 13.1 Otimizações Atuais
- Carregamento sob demanda de páginas
- Eventos delegados quando possível
- Debounce em filtros (a implementar)
- CSS minificado (produção)

### 13.2 A Implementar
- Lazy loading de imagens
- Code splitting
- Cache de recursos estáticos
- Compressão gzip
- CDN para assets

---

## 14. ESTRUTURA DE ARQUIVOS

```
nhee-frontend/
├── index.html                  # Shell principal
├── resources/
│   ├── main.css               # Estilos globais
│   ├── main.js                # Roteamento SPA
│   ├── bootstrap/             # Framework CSS
│   └── images/
│       └── logo.png           # Logo 65x65px
├── features/
│   ├── authentication/
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   └── pages/
│       ├── home/
│       ├── about/
│       ├── contact/
│       ├── texts/             # Lista de textos
│       ├── text-view/         # Visualização completa
│       ├── new-text/          # Criar texto
│       ├── edit-text/         # Editar texto
│       ├── add-question/      # Adicionar dúvida
│       ├── my-account/        # Gerenciar conta
│       ├── my-texts/          # Meus textos
│       ├── concept-map/       # Grafo de conhecimento
│       └── 404/
└── server/
    └── nginx/                 # Servidor web
```

---

## 15. CONVENÇÕES DE CÓDIGO

### 15.1 JavaScript
- camelCase para variáveis e funções
- PascalCase para classes (quando usar)
- Constantes em UPPER_CASE
- Comentários descritivos
- Console.log para debug (remover em produção)

### 15.2 CSS
- kebab-case para classes
- BEM quando apropriado
- Mobile-first quando possível
- Prefixos para compatibilidade

### 15.3 HTML
- Semântico sempre que possível
- Atributos em ordem: class, id, data-*, outros
- Indentação de 4 espaços
- Comentários para seções complexas

---

## 16. FLUXOS DE TRABALHO

### 16.1 Criar Novo Texto
1. Usuário clica "+ Novo Texto"
2. Verificação de autenticação
3. Formulário exibido
4. Preenchimento de campos obrigatórios
5. Opcionais de fundamentação
6. Critérios de autenticidade
7. Validação client-side
8. Submissão (simula sucesso)
9. Redirecionamento para lista

### 16.2 Editar Texto
1. Usuário clica "Editar" em Meus Textos
2. ID salvo no localStorage
3. Redirecionamento para #edit-text
4. Carregamento dos dados (mock)
5. Preenchimento automático do formulário
6. Alterações realizadas
7. Validação
8. Submissão
9. Atualização e feedback

### 16.3 Avaliar Autenticidade
1. Usuário clica no badge de autenticidade
2. Modal exibido
3. Verificação de login
4. Formulário de avaliação ou botão login
5. Seleção da nota (1-10)
6. Submissão
7. Atualização da média
8. Feedback visual

---

## 17. MENSAGENS E FEEDBACK

### 17.1 Mensagens de Sucesso
- Background verde (#27ae60)
- Animação slideIn
- Auto-hide após ação (quando apropriado)
- Botão de ação incluído

### 17.2 Mensagens de Erro
- Background vermelho (#e74c3c)
- Texto claro e específico
- Sugestão de correção quando possível
- Feedback inline em formulários

### 17.3 Loading States
- Spinner centralizado
- Background escuro semi-transparente
- z-index elevado
- Classe .active para controle

---

## 18. INTEGRAÇÃO FUTURA

### 18.1 Backend API Endpoints (Planejado)
```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/forgot-password
GET    /api/texts
GET    /api/texts/:id
POST   /api/texts
PUT    /api/texts/:id
DELETE /api/texts/:id
GET    /api/texts/:id/questions
POST   /api/texts/:id/questions
POST   /api/texts/:id/authenticity
GET    /api/users/profile
PUT    /api/users/profile
GET    /api/concept-map
GET    /api/concepts
```

### 18.2 WebSocket (Planejado)
- Notificações em tempo real
- Atualizações de autenticidade
- Novas dúvidas/comentários
- Chat (se implementado)

---

## 19. TESTES (A Implementar)

### 19.1 Testes Unitários
- Funções de validação
- Formatação de dados
- Cálculos (média de autenticidade)

### 19.2 Testes de Integração
- Fluxos completos de usuário
- Navegação SPA
- Autenticação

### 19.3 Testes E2E
- Cadastro → Login → Criar texto → Avaliar
- Navegação completa
- Responsividade

---

## 20. ROADMAP

### 20.1 Fase Atual (Frontend Completo)
✅ Estrutura SPA
✅ Autenticação simulada
✅ CRUD de textos
✅ Sistema de autenticidade
✅ Dúvidas/comentários
✅ Mapa conceitual
✅ Gerenciamento de conta

### 20.2 Próximos Passos
🔲 Integração com backend
🔲 Sistema de upload de imagens
🔲 Notificações em tempo real
🔲 Sistema de busca avançada
🔲 Exportar textos (PDF)
🔲 Compartilhamento social
🔲 Sistema de badges/gamificação
🔲 Modo escuro/claro toggle
🔲 Internacionalização (i18n)
🔲 PWA (Progressive Web App)

---

## NOTAS FINAIS

Este documento descreve as regras e especificações da plataforma **Nhe'ẽ porã** em seu estado atual (Janeiro 2026). Todas as funcionalidades estão implementadas com dados mockados e devem ser integradas com um backend real para produção.

**Manutenção do documento:** Atualizar sempre que novas funcionalidades forem adicionadas ou regras modificadas.

**Versão:** 1.0
**Data:** Janeiro 2, 2026
**Autor:** Desenvolvimento Nhe'ẽ porã
