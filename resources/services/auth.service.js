/**
 * AuthService - Serviço de autenticação
 * Gerencia login, registro, logout e validação de sessão
 */

class AuthService {
    constructor() {
        this.api = window.ApiService;
        this.endpoints = ApiConfig.endpoints.auth;
    }

    /**
     * Login de usuário
     */
    async login(credentials) {
        try {
            const response = await this.api.post(this.endpoints.login, credentials);
            
            // Salvar token e dados do usuário
            if (response.token) {
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('username', response.user.username || credentials.username);
                
                if (response.user) {
                    localStorage.setItem('userData', JSON.stringify(response.user));
                }
            }
            
            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    /**
     * Registro de novo usuário
     */
    async register(userData) {
        try {
            const response = await this.api.post(this.endpoints.register, userData);
            
            // Auto-login após registro bem-sucedido
            if (response.token) {
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('username', response.user.username || userData.username);
                localStorage.setItem('userData', JSON.stringify(response.user));
            }
            
            return response;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    }

    /**
     * Logout
     */
    async logout() {
        try {
            // Tentar notificar o backend
            await this.api.post(this.endpoints.logout);
        } catch (error) {
            console.warn('Logout backend error:', error);
        } finally {
            // Limpar dados locais independentemente do resultado
            this.clearSession();
        }
    }

    /**
     * Limpar sessão local
     */
    clearSession() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('userData');
        this.api.clearCache();
    }

    /**
     * Recuperação de senha
     */
    async forgotPassword(email) {
        try {
            return await this.api.post(this.endpoints.forgotPassword, { email });
        } catch (error) {
            console.error('Forgot password error:', error);
            throw error;
        }
    }

    /**
     * Reset de senha
     */
    async resetPassword(token, newPassword) {
        try {
            return await this.api.post(this.endpoints.resetPassword, { 
                token, 
                password: newPassword 
            });
        } catch (error) {
            console.error('Reset password error:', error);
            throw error;
        }
    }

    /**
     * Validar token atual
     */
    async validateToken() {
        try {
            const response = await this.api.get(this.endpoints.validateToken);
            return response.valid === true;
        } catch (error) {
            this.clearSession();
            return false;
        }
    }

    /**
     * Verificar se está autenticado
     */
    isAuthenticated() {
        return localStorage.getItem('loggedIn') === 'true' && 
               localStorage.getItem('authToken') !== null;
    }

    /**
     * Obter dados do usuário atual
     */
    getCurrentUser() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    }

    /**
     * Obter nome do usuário
     */
    getUsername() {
        return localStorage.getItem('username');
    }
}

// Instância singleton
const authService = new AuthService();

// Tornar disponível globalmente
window.AuthService = authService;
