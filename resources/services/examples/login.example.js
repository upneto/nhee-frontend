// Exemplo de login usando AuthService
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginAlert = document.getElementById('loginAlert');

function showAlert(message, type = 'danger') {
    loginAlert.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => {
        loginAlert.innerHTML = '';
    }, 5000);
}

function validateField(input) {
    if (input.validity.valid) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        return true;
    } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        return false;
    }
}

// Validação em tempo real
usernameInput.addEventListener('input', () => validateField(usernameInput));
passwordInput.addEventListener('input', () => validateField(passwordInput));

loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const isUsernameValid = validateField(usernameInput);
    const isPasswordValid = validateField(passwordInput);
    
    if (!isUsernameValid || !isPasswordValid) {
        showAlert('Por favor, corrija os erros no formulário.', 'danger');
        return;
    }
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    try {
        // Usar AuthService para login real
        const response = await AuthService.login({
            username: username,
            password: password
        });
        
        showAlert('Login realizado com sucesso!', 'success');
        
        setTimeout(() => {
            window.location.hash = 'home';
        }, 1000);
        
    } catch (error) {
        // Erro já é tratado pelo ApiService e exibe mensagem amigável
        showAlert(error.message || 'Erro ao fazer login. Verifique suas credenciais.', 'danger');
    }
});
