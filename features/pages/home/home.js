// Home JS - Nhe'ẽ porã
console.log('Home page loaded - Nhe\'ẽ porã');

// Exibir mensagem de boas-vindas personalizada
const username = localStorage.getItem('username');
const welcomeMessage = document.getElementById('welcomeMessage');

if (username && welcomeMessage) {
    welcomeMessage.textContent = `Bem-vindo de volta, ${username}! Continue explorando e participando dos debates.`;
}