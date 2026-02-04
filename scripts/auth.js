/* Authentication Logic (Mock) */

export class Auth {
    static login(email, password) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            window.location.href = 'index.html';
            return { success: true };
        }
        return { success: false, message: 'Invalid credentials' };
    }

    static signup(name, email, password) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        if (users.find(u => u.email === email)) {
            return { success: false, message: 'User already exists' };
        }

        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            role: email.includes('admin') ? 'admin' : 'user' // Auto-admin if email has 'admin'
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Auto login
        localStorage.setItem('user', JSON.stringify(newUser));
        window.location.href = 'index.html';
        return { success: true };
    }

    static logout() {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }

    static checkAuth() {
        const user = localStorage.getItem('user');
        if (!user) {
            window.location.href = 'login.html';
        }
        return JSON.parse(user);
    }
}
