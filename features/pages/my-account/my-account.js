// My Account Page JS
console.log('My Account page loaded');

// Contador de caracteres para bio
setTimeout(() => {
    const bioTextarea = document.getElementById('bio');
    const bioCharCount = document.getElementById('bioCharCount');

    if (bioTextarea && bioCharCount) {
        // Atualizar contador inicial
        bioCharCount.textContent = bioTextarea.value.length;

        // Atualizar ao digitar
        bioTextarea.addEventListener('input', function() {
            bioCharCount.textContent = this.value.length;
        });
    }

    // Validação de senha
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');

    if (confirmPassword) {
        confirmPassword.addEventListener('input', function() {
            if (newPassword.value && this.value !== newPassword.value) {
                this.classList.add('is-invalid');
            } else {
                this.classList.remove('is-invalid');
            }
        });
    }

    // Submit do formulário
    const accountForm = document.getElementById('accountForm');
    if (accountForm) {
        accountForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validar campos obrigatórios
            let isValid = true;

            const email = document.getElementById('email');
            const fullName = document.getElementById('fullName');
            const currentPassword = document.getElementById('currentPassword');

            // Validar email
            if (!email.value || !email.value.includes('@')) {
                email.classList.add('is-invalid');
                isValid = false;
            } else {
                email.classList.remove('is-invalid');
            }

            // Validar nome completo
            if (!fullName.value || fullName.value.length < 3) {
                fullName.classList.add('is-invalid');
                isValid = false;
            } else {
                fullName.classList.remove('is-invalid');
            }

            // Validar senhas se estiver tentando alterar
            if (newPassword.value || confirmPassword.value) {
                // Se preencheu nova senha, deve preencher senha atual
                if (!currentPassword.value) {
                    alert('Para alterar a senha, você deve informar sua senha atual.');
                    currentPassword.focus();
                    return;
                }

                // Validar tamanho da nova senha
                if (newPassword.value.length < 6) {
                    newPassword.classList.add('is-invalid');
                    isValid = false;
                } else {
                    newPassword.classList.remove('is-invalid');
                }

                // Validar se senhas coincidem
                if (newPassword.value !== confirmPassword.value) {
                    confirmPassword.classList.add('is-invalid');
                    isValid = false;
                } else {
                    confirmPassword.classList.remove('is-invalid');
                }
            }

            if (!isValid) {
                return;
            }

            // Simular salvamento
            console.log('Salvando dados da conta...');
            console.log({
                email: email.value,
                fullName: fullName.value,
                institution: document.getElementById('institution').value,
                fieldOfStudy: document.getElementById('fieldOfStudy').value,
                bio: bioTextarea.value,
                passwordChanged: !!newPassword.value
            });

            // Mostrar mensagem de sucesso
            const successMessage = document.getElementById('successMessage');
            if (successMessage) {
                successMessage.style.display = 'block';
                
                // Scroll para a mensagem
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Limpar campos de senha
                if (currentPassword) currentPassword.value = '';
                if (newPassword) newPassword.value = '';
                if (confirmPassword) confirmPassword.value = '';

                // Esconder mensagem após 5 segundos
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000);
            }

            // TODO: Integrar com backend para salvar dados reais
        });
    }

    // Carregar dados do usuário do localStorage
    const username = localStorage.getItem('username');
    const usernameField = document.getElementById('username');
    if (username && usernameField) {
        usernameField.value = username;
    }
}, 100);
