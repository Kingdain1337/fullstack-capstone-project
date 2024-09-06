import React, { useState } from 'react';
import './RegisterPage.css';
function RegisterPage() {
    const {firstName, setFirstName} = useState('First Name');
    const {lastName, setLastName} = useState('Last Name');
    const {email, setEmail} = useState('Email');
    const {password, setPassword} = useState('Password');


function handleRegister(firstName, lastName, email, password) {
    

    // Validate first name
    if (!isValidName(firstName)) {
        throw new Error('First name is required');
    } else {
        setFirstName(firstName.trim());
    }

    // Validate last name
    if (!isValidName(lastName)) {
        throw new Error('Last name is required');
    } else {
        setLastName(lastName.trim());
    }

    // Validate email
    if (!isValidEmail(email)) {
        throw new Error('Invalid email format or email is missing');
    } else {
        setEmail(email.trim());
    }

    // Validate password
    if (!isValidPassword(password)) {
        throw new Error('Password must be at least 8 characters long and include at least one number');
    } else {
        setPassword(password.trim());
    }

    // Proceed if all values are valid
    console.log('All values are valid. Proceeding with registration.');
}
    // Validation functions
const isValidName = (name) => {
    return name && name.trim() !== '';
};
const isValidEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return email && email.trim() !== '' && emailPattern.test(email);
};
const isValidPassword = (password) => {
    return password && password.trim() !== '' && password.length >= 8 && /\d/.test(password);
};
    
return (
    <div className="register-container">
        <div className="register-card">
            <h2 className="text-center mb-4">Register</h2>
            <input
                type="text"
                placeholder={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <input
                type="text"
                placeholder={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <input
                type="email"
                placeholder={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn-primary" onClick={() => handleRegister([firstName, lastName, email, password])}>
                Register
            </button>
            <p className="text-center mt-4">
                Already a member? <a href="/app/login" className="text-primary">Login</a>
            </p>
        </div>
    </div>
);
}
export default RegisterPage;