/**
 * ContactService - Serviço para envio de mensagens de contato
 */

class ContactService {
    constructor() {
        this.api = window.ApiService;
        this.endpoints = ApiConfig.endpoints.contact;
    }

    /**
     * Enviar mensagem de contato
     */
    async send(contactData) {
        try {
            return await this.api.post(this.endpoints.send, contactData);
        } catch (error) {
            console.error('Send contact error:', error);
            throw error;
        }
    }
}

// Instância singleton
const contactService = new ContactService();

// Tornar disponível globalmente
window.ContactService = contactService;
