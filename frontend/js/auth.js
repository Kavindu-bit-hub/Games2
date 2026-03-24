class AuthManager {
    constructor() {
        this.loginForm = document.getElementById('loginForm');
        this.signupForm = document.getElementById('signupForm');
        this.tabs = document.querySelectorAll('.auth-tab');
        this.init();
    }
    
    init() {
        this.setupTabs();
        this.setupForms();
        this.setupPasswordToggle();
        this.setupPasswordStrength();
    }
    
    setupTabs() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.tab;
                
                this.tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                if (target === 'login') {
                    this.loginForm.classList.remove('hidden');
                    this.signupForm.classList.add('hidden');
                } else {
                    this.loginForm.classList.add('hidden');
                    this.signupForm.classList.remove('hidden');
                }
            });
        });
    }
    
    setupForms() {
        this.loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });
        
        this.signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSignup();
        });
    }
    
    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const btn = this.loginForm.querySelector('button[type="submit"]');
        
        this.setLoading(btn, true);
        
        try {
            // Replace with actual API
            // const response = await fetch('http://localhost:8080/api/auth/login', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email, password })
            // });
            // const data = await response.json();
            // localStorage.setItem('token', data.token);
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            window.gameVault.showNotification('Login successful!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
            
        } catch (error) {
            window.gameVault.showNotification('Invalid credentials', 'error');
            this.setLoading(btn, false);
        }
    }
    
    async handleSignup() {
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirm = document.getElementById('signupConfirm').value;
        const btn = this.signupForm.querySelector('button[type="submit"]');
        
        if (password !== confirm) {
            window.gameVault.showNotification('Passwords do not match', 'error');
            return;
        }
        
        this.setLoading(btn, true);
        
        try {
            // Replace with actual API
            // const response = await fetch('http://localhost:8080/api/auth/signup', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ name, email, password })
            // });
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            window.gameVault.showNotification('Account created successfully!', 'success');
            setTimeout(() => {
                this.tabs[0].click();
            }, 1000);
            
        } catch (error) {
            window.gameVault.showNotification('Signup failed', 'error');
            this.setLoading(btn, false);
        }
    }
    
    setLoading(btn, loading) {
        const loader = btn.querySelector('.btn-loader');
        const text = btn.querySelector('span');
        
        btn.disabled = loading;
        loader.hidden = !loading;
        text.textContent = loading ? '' : (btn.closest('#loginForm') ? 'Login' : 'Create Account');
    }
    
    setupPasswordToggle() {
        const toggle = document.querySelector('.toggle-password');
        const input = document.getElementById('loginPassword');
        
        if (toggle) {
            toggle.addEventListener('click', () => {
                input.type = input.type === 'password' ? 'text' : 'password';
                toggle.textContent = input.type === 'password' ? '👁️' : '🙈';
            });
        }
    }
    
    setupPasswordStrength() {
        const input = document.getElementById('signupPassword');
        const indicator = document.getElementById('passwordStrength');
        
        if (!input) return;
        
        input.addEventListener('input', () => {
            const value = input.value;
            let strength = '';
            
            if (value.length === 0) {
                strength = '';
            } else if (value.length < 6) {
                strength = 'weak';
            } else if (value.length < 10 || !/[A-Z]/.test(value) || !/[0-9]/.test(value)) {
                strength = 'medium';
            } else {
                strength = 'strong';
            }
            
            indicator.className = 'password-strength ' + strength;
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});