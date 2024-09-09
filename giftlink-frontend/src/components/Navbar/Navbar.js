import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AuthContext';

export default function Navbar() {
    const { isLoggedIn, userName, handleLogout } = useAppContext();
    const navigate = useNavigate();

    const profileSection = () => {
        navigate(`/app/profile`);
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light" id='navbar_container'>
                <a className="navbar-brand" href={`/app`}>GiftLink</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="/home.html">Home</a>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/app">Gifts</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/app/search">Search</Link>
                        </li>
                        <ul className="navbar-nav ml-auto">
                            {isLoggedIn ? (
                                <>
                                    <li className="nav-item">
                                        <span className="nav-link" style={{ color: "black", cursor: "pointer" }} onClick={profileSection}>Welcome, {userName}</span>
                                    </li>
                                    <li className="nav-item">
                                        <button className="nav-link login-btn" onClick={handleLogout}>Logout</button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link login-btn" to="/app/login">Login</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link register-btn" to="/app/register">Register</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </ul>
                </div>
            </nav>
        </>
    );
}
/*interesting Now whoever we are logged in or not on the home page, we are immediately spit to the login page. we don't necessarily want that. we want the user to be  able to brows around in the mainpage and then only be checkd if they try to acces the profile page or the details page.*/