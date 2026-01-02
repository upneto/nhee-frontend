// Main JS - SPA Router
const content = document.getElementById('content');
const nav = document.querySelector('nav');
const footer = document.querySelector('footer');
const loadingSpinner = document.getElementById('loadingSpinner');

console.log('Content element:', content);
console.log('Nav element:', nav);

let currentCssLink = null;
let currentScript = null;

function showLoading() {
    if (loadingSpinner) {
        loadingSpinner.classList.add('active');
    }
}

function hideLoading() {
    if (loadingSpinner) {
        loadingSpinner.classList.remove('active');
    }
}

function loadPage(page) {
    // Verificar autenticação apenas para páginas que requerem interação
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    console.log('Loading page:', page, 'isLoggedIn:', isLoggedIn);
    
    // Páginas públicas (não requerem autenticação)
    const publicPages = ['login', 'register', 'forgot-password', 'home', 'about', 'contact', 'texts', 'text-view', 'concept-map', '404'];
    
    // Páginas que requerem autenticação
    const authRequiredPages = ['new-text', 'add-question', 'my-account', 'my-texts', 'edit-text'];
    
    // Se não está logado e tenta acessar página restrita, redireciona para login
    if (!publicPages.includes(page) && !isLoggedIn) {
        console.log('Redirecting to login - restricted page');
        window.location.hash = 'login';
        return;
    }

    showLoading();

    let path = 'features/pages/';
    if (['login', 'register', 'forgot-password'].includes(page)) {
        path = 'features/authentication/';
    }
    
    fetch(`${path}${page}/${page}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            content.innerHTML = html;
           
            // Remove CSS da pagina anterior para não gerar conflito
            if (currentCssLink) {
                document.head.removeChild(currentCssLink);
            }
            
            // Carrega CSS da pagina 
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `${path}${page}/${page}.css`;
            link.onerror = () => {
                console.warn(`CSS file not found: ${link.href}`);
            };
            document.head.appendChild(link);
            currentCssLink = link;
            
            
            // Remove js da pagina anterior para não gerar conflito
            if (currentScript) {
                document.body.removeChild(currentScript);
            }
            
            // Carrega js da pagina 
            const script = document.createElement('script');
            script.src = `${path}${page}/${page}.js`;
            script.onerror = () => {
                console.warn(`JS file not found: ${script.src}`);
            };
            document.body.appendChild(script);
            currentScript = script;
            
            // Controlar visibilidade do menu e footer
            if (['login', 'register', 'forgot-password'].includes(page)) {
                nav.style.display = 'none';
                footer.style.display = 'none';
            } else {
                nav.style.display = 'flex';
                footer.style.display = 'block';
                
                // Atualizar links de login/logout no menu
                updateMenuAuthLinks();
            }
            
            hideLoading();
        })
        .catch(error => {
            console.error('Error loading page:', error);
            
            // Tentar carregar página 404
            if (page !== '404') {
                loadPage('404');
            } else {
                content.innerHTML = '<div class="error-container text-center"><h1>Erro ao carregar página</h1><p>Ocorreu um erro inesperado. Por favor, tente novamente.</p></div>';
                hideLoading();
            }
        });
}

// Executa funcao quando URL é altearada
window.addEventListener('hashchange', () => {
    const page = location.hash.substring(1) || 'login';
    loadPage(page);
});

// Carrega página inicial (sempre home, autenticação não é mais obrigatória)
const currentHash = location.hash.substring(1) || 'home';
loadPage(currentHash);

// Atualizar links de autenticação no menu
function updateMenuAuthLinks() {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    const myReflectionsDropdown = document.getElementById('myReflectionsDropdown');
    
    if (isLoggedIn) {
        if (loginLink) loginLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'inline';
        if (myReflectionsDropdown) myReflectionsDropdown.style.display = 'block';
    } else {
        if (loginLink) loginLink.style.display = 'inline';
        if (logoutLink) logoutLink.style.display = 'none';
        if (myReflectionsDropdown) myReflectionsDropdown.style.display = 'none';
    }
}

// Atualizar no carregamento
updateMenuAuthLinks();

/*
* -----------------------------------------------------------------
*           FUNCOES GLOBAIS DO SISTEMA
* -----------------------------------------------------------------
*/

/**
 * Event listener global para cliques
 */
document.addEventListener('click', function(e) {
    // Controle do dropdown - Minhas Reflexões
    const dropdown = document.getElementById('myReflectionsDropdown');
    if (dropdown) {
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
        
        // Se clicou no toggle, alterna o dropdown
        if (dropdownToggle && (e.target === dropdownToggle || dropdownToggle.contains(e.target))) {
            e.preventDefault();
            dropdown.classList.toggle('active');
        } 
        // Se clicou fora do dropdown, fecha
        else if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    }
    
    // Funcao de Logout
    if (e.target.id === 'logoutLink') {
        e.preventDefault();
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('username');
        updateMenuAuthLinks();
        window.location.hash = 'home';
    }
});