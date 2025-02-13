
console.log("Auth script loaded!");

class AuthUI {
    static registerForm() {
        return `
            <div class="card">
                <div class="card-header text-center">Register</div>
                <div class="card-body">
                    <form id="register-form">
                        <div class="form-group">
                            <input type="text" name="username" placeholder="Username" class="form-control" required>
                            <input type="password" name="password" placeholder="Password" class="form-control" required>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block">Register</button>
                    </form>
                    <div class="alert alert-danger mt-2" id="register-error" style="display: none;"></div>
                </div>
            </div>
        `;
    }

    static loginForm() {
        return `
            <div class="card">
                <div class="card-header text-center">Login</div>
                <div class="card-body">
                    <form id="login-form">
                        <div class="form-group">
                            <input type="text" name="username" placeholder="Username" class="form-control" required>
                            <input type="password" name="password" placeholder="Password" class="form-control" required>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block">Login</button>
                    </form>
                    <div class="alert alert-danger mt-2" id="login-error" style="display: none;"></div>
                </div>
            </div>
        `;
    }
}


document.addEventListener('DOMContentLoaded', () => {


    const registerCard = document.getElementById('register-card');
    const loginCard = document.getElementById('login-card');

    if (registerCard && loginCard) {
        registerCard.innerHTML = AuthUI.registerForm();
        loginCard.innerHTML = AuthUI.loginForm();
    } else {
        console.error("Error: No se encontró 'register-card' o 'login-card' en el DOM.");
    }
});

class AuthService {
    static register(formData) {
        return fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(formData.entries()))
        }).then(response => response.json());
    }

    static login(formData) {
        return fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(formData.entries()))
        }).then(response => response.json());
    }

    static saveToken(token) {
        localStorage.setItem('token', token);
    }

    static getToken() {
        return localStorage.getItem('token');
    }

    static logout() {
        localStorage.removeItem('token');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('register-card').innerHTML = AuthUI.registerForm();
    document.getElementById('login-card').innerHTML = AuthUI.loginForm();

    document.getElementById('register-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const response = await AuthService.register(data);

        if (response.message) {
            alert('Registration successful! Please login.');
        } else {
            document.getElementById('register-error').innerText = response.error;
            document.getElementById('register-error').style.display = 'block';
        }
    });

    document.getElementById('login-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const response = await AuthService.login(data);

        if (response.access_token) {
            AuthService.saveToken(response.access_token);
            AppUI.showTasks();
        } else {
            document.getElementById('login-error').innerText = 'Invalid credentials';
            document.getElementById('login-error').style.display = 'block';
        }
    });
});
