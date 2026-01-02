// Forgot Password JS
const forgotForm = document.getElementById('forgotForm');
const emailInput = document.getElementById('email');
const forgotAlert = document.getElementById('forgotAlert');

function showAlert(message, type = 'danger') {
    forgotAlert.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => {
        forgotAlert.innerHTML = '';
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

emailInput.addEventListener('input', () => validateField(emailInput));

forgotForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const isEmailValid = validateField(emailInput);
    
    if (!isEmailValid) {
        showAlert('Por favor, insira um email válido.', 'danger');
        return;
    }
    
    const email = emailInput.value.trim();
    
    // Simulação de envio de email (substitua por chamada real para backend)
    showAlert('Link de recuperação enviado para ' + email + '!', 'success');
    setTimeout(() => {
        window.location.hash = 'login';
    }, 2000);
});