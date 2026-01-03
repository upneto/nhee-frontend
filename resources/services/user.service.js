/**
 * UserService - Serviço para gerenciamento de usuários
 * Perfil, configurações e dados do usuário
 */

class UserService {
    constructor() {
        this.api = window.ApiService;
        this.endpoints = ApiConfig.endpoints.users;
    }

    /**
     * Obter perfil do usuário autenticado
     */
    async getProfile() {
        try {
            const profile = await this.api.get(this.endpoints.profile);
            
            // Atualizar cache local
            localStorage.setItem('userData', JSON.stringify(profile));
            
            return profile;
        } catch (error) {
            console.error('Get profile error:', error);
            throw error;
        }
    }

    /**
     * Atualizar perfil do usuário
     */
    async updateProfile(userData) {
        try {
            const updated = await this.api.put(this.endpoints.update, userData);
            
            // Atualizar cache local
            localStorage.setItem('userData', JSON.stringify(updated));
            if (updated.username) {
                localStorage.setItem('username', updated.username);
            }
            
            return updated;
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    }

    /**
     * Alterar senha
     */
    async changePassword(oldPassword, newPassword) {
        try {
            return await this.api.post(this.endpoints.changePassword, {
                oldPassword,
                newPassword
            });
        } catch (error) {
            console.error('Change password error:', error);
            throw error;
        }
    }
}

// Instância singleton
const userService = new UserService();

// Tornar disponível globalmente
window.UserService = userService;
