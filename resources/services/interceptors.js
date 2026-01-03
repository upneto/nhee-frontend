/**
 * Interceptors - Middleware para requisições HTTP
 * Gerencia loading, logs e tratamento global de erros
 */

class HttpInterceptors {
    constructor() {
        this.loadingCount = 0;
        this.loadingSpinner = null;
        this.requestListeners = [];
        this.responseListeners = [];
        this.errorListeners = [];
    }

    /**
     * Inicializar interceptors
     */
    init() {
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this._patchFetch();
    }

    /**
     * Adicionar listener para antes de cada requisição
     */
    addRequestListener(callback) {
        this.requestListeners.push(callback);
    }

    /**
     * Adicionar listener para após cada resposta bem-sucedida
     */
    addResponseListener(callback) {
        this.responseListeners.push(callback);
    }

    /**
     * Adicionar listener para erros
     */
    addErrorListener(callback) {
        this.errorListeners.push(callback);
    }

    /**
     * Mostrar loading spinner
     */
    showLoading() {
        this.loadingCount++;
        if (this.loadingSpinner && this.loadingCount > 0) {
            this.loadingSpinner.classList.add('active');
        }
    }

    /**
     * Esconder loading spinner
     */
    hideLoading() {
        this.loadingCount--;
        if (this.loadingSpinner && this.loadingCount <= 0) {
            this.loadingCount = 0;
            this.loadingSpinner.classList.remove('active');
        }
    }

    /**
     * Executar listeners de requisição
     */
    _executeRequestListeners(url, options) {
        this.requestListeners.forEach(listener => {
            try {
                listener(url, options);
            } catch (error) {
                console.error('Request listener error:', error);
            }
        });
    }

    /**
     * Executar listeners de resposta
     */
    _executeResponseListeners(response) {
        this.responseListeners.forEach(listener => {
            try {
                listener(response);
            } catch (error) {
                console.error('Response listener error:', error);
            }
        });
    }

    /**
     * Executar listeners de erro
     */
    _executeErrorListeners(error) {
        this.errorListeners.forEach(listener => {
            try {
                listener(error);
            } catch (error) {
                console.error('Error listener error:', error);
            }
        });
    }

    /**
     * Patch do fetch global para adicionar interceptors
     */
    _patchFetch() {
        const originalFetch = window.fetch;
        const self = this;

        window.fetch = async function(...args) {
            const [url, options = {}] = args;
            
            // Executar listeners de requisição
            self._executeRequestListeners(url, options);
            
            // Mostrar loading
            self.showLoading();
            
            try {
                const response = await originalFetch(...args);
                
                // Executar listeners de resposta
                self._executeResponseListeners(response.clone());
                
                return response;
                
            } catch (error) {
                // Executar listeners de erro
                self._executeErrorListeners(error);
                throw error;
                
            } finally {
                // Esconder loading
                self.hideLoading();
            }
        };
    }

    /**
     * Log de requisições (útil para debug)
     */
    logRequest(url, options) {
        console.log(`[HTTP ${options.method || 'GET'}]`, url);
        if (options.body) {
            console.log('Request body:', options.body);
        }
    }

    /**
     * Log de respostas (útil para debug)
     */
    logResponse(response) {
        console.log(`[HTTP ${response.status}]`, response.url);
    }

    /**
     * Handler global de erros
     */
    handleGlobalError(error) {
        console.error('HTTP Error:', error);
        
        // Mostrar notificação de erro ao usuário
        this.showErrorNotification(error.message || 'Erro na requisição');
    }

    /**
     * Mostrar notificação de erro
     */
    showErrorNotification(message) {
        // Criar elemento de notificação se não existir
        let notification = document.getElementById('globalErrorNotification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'globalErrorNotification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: #c9302c;
                color: white;
                padding: 16px 24px;
                border-radius: 4px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 10000;
                max-width: 400px;
                font-family: 'Crimson Text', serif;
                display: none;
            `;
            document.body.appendChild(notification);
        }
        
        notification.textContent = message;
        notification.style.display = 'block';
        
        // Auto-esconder após 5 segundos
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }
}

// Instância singleton
const httpInterceptors = new HttpInterceptors();

// Configurar interceptors padrão
document.addEventListener('DOMContentLoaded', () => {
    httpInterceptors.init();
    
    // Adicionar log em desenvolvimento
    if (window.location.hostname === 'localhost') {
        httpInterceptors.addRequestListener((url, options) => 
            httpInterceptors.logRequest(url, options)
        );
        httpInterceptors.addResponseListener((response) => 
            httpInterceptors.logResponse(response)
        );
    }
    
    // Handler global de erros
    httpInterceptors.addErrorListener((error) => 
        httpInterceptors.handleGlobalError(error)
    );
});

// Tornar disponível globalmente
window.HttpInterceptors = httpInterceptors;
