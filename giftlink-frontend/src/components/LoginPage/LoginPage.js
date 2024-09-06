import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleLogin() {
        if (!isValidEmail(email)) {
            throw new Error('Invalid email format or email is missing');
        }
        if (!isValidPassword(password)) {
            throw new Error('Password must be at least 8 characters long and include at least one number');
        }

        console.log('Login successful:', { email, password });
    }

    const isValidEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return email && email.trim() !== '' && emailPattern.test(email);
    };

    const isValidPassword = (password) => password && password.length >= 8 && /\d/.test(password);

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="text-center mb-4">Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                <button className="btn-primary" onClick={handleLogin}>
                    Login
                </button>
                <p className="text-center mt-4">
                    Don't have an account? <a href="/app/register" className="text-primary">Register</a>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
