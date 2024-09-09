import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showerr, setShowerr] = useState('');

    const navigate = useNavigate();
    const { handleLogin } = useAppContext(); // Get handleLogin from context

    const handleLoginClick = async () => {
        if (!isValidEmail(email)) {
            setShowerr('Invalid email format or email is missing');
            return;
        }
        if (!isValidPassword(password)) {
            setShowerr('Password must be at least 8 characters long and include at least one number');
            return;
        }

        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }
            
            // Use context function to set login state and session storage
            handleLogin(data.userName, data.userEmail, data.authtoken);

            navigate('/app');
            console.log('Login successful', data);
        } catch (e) {
            setShowerr(e.message);
        }
    };

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
                <button className="btn-primary" onClick={handleLoginClick}>
                    Login
                </button>
                {showerr && <p className="error-message">{showerr}</p>}
                <p className="text-center mt-4">
                    Don't have an account? <a href="/app/register" className="text-primary">Register</a>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
