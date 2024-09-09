import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';

function RegisterPage() {
    const [firstName, setFirstName] = useState('First Name');
    const [lastName, setLastName] = useState('Last Name');
    const [email, setEmail] = useState('Email');
    const [password, setPassword] = useState('Password');
    const [showerr, setShowerr] = useState('');

    const navigate = useNavigate();
    const { handleLogin } = useAppContext();

    const handleRegister = async () => {
        if (!isValidName(firstName)) {
            setShowerr('First name is required');
            return;
        }
        if (!isValidName(lastName)) {
            setShowerr('Last name is required');
            return;
        }
        if (!isValidEmail(email)) {
            setShowerr('Invalid email format or email is missing');
            return;
        }
        if (!isValidPassword(password, 8)) {
            setShowerr('Password must be at least 8 characters long and include at least one number');
            return;
        }
        console.log('All values are valid. Proceeding with registration.');

        try {                                                                                                         // <--- Fetch request here
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
                method: 'POST',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify({
                    email: email,
                    password: password,
                    firstName: firstName,
                    lastName: lastName
                })
            });

            const data = await response.json();
            if (!response.ok) {
                console.error('Error response from server:', data);
                throw new Error(data.error || 'Registration failed');
            }
            console.log('Registration successful, user details:', data);

            // Use context function to update session storage and login state
            handleLogin(firstName, email, data.authtoken);

            navigate('/app');
        } catch (e) {
            setShowerr(e.message);
        }
    };

    // Validation functions
    const isValidName = (name) => name && name !== '';
    const isValidEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return email && email !== '' && emailPattern.test(email);
    };
    const isValidPassword = (password, minPasswordLength) => 
        password && password !== '' && password.length >= minPasswordLength && /\d/.test(password);

    return (
        <div className="register-container">
            <div className="register-card">
                <h2 className="text-center mb-4">Register</h2>
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="btn-primary" onClick={handleRegister}>
                    Register
                </button>
                {showerr && <p className="error-message">{showerr}</p>}
                <p className="text-center mt-4">
                    Already a member? <a href="/app/login" className="text-primary">Login</a>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
