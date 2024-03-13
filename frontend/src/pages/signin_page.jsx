import React, { useState, useLayoutEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useToast, Spinner } from "@chakra-ui/react";
import { useUser } from '../../src/UserContext';
import './signin_page.css';
import logo from '../assets/CineShare Logo Request.webp';

function SigninPage({ setShowNavbar }) {
    const navigate = useNavigate();
    const toast = useToast();
    const userContext = useUser();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    useLayoutEffect(() => {
        setShowNavbar(false);
    }, []);

    const navigateHome = () => {
        navigate('/home_page');
        setShowNavbar(true);
    };

    const navigateCreateAccount = () => {
        navigate('/createacct_page');
        setShowNavbar(true);
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password })
            });

            if (res.status === 500) {
                // if server is not reachable
                throw new Error('Server responded with a status: 500 Internal Server Error');
            }

            const data = await res.json();

            if (res.status === 400) {
                // wrong password or other client-side error
                setErrorMessage("Incorrect Email or Password");
            } else {
                // successful login
                userContext.updateUser(data.username);
                // Store the token in local storage
                localStorage.setItem("token", data.token);
                navigateHome();
            }
        } catch (error) {
            // if server is not reachable
            console.error('An error occurred:', error);
            setErrorMessage("An error has occurred");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="signin-fullscreen">
            <div className="signin-side-bar">
                <img src={logo} alt="logo" height="400px" width="400px" />
            </div>
            <div className="signin-container">
                <div className="login-container">
                    <h2>Sign In</h2>
                    <div className="login-form">
                        <form onSubmit={handleLogin}>
                            <div className="input-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="example@gmail.com"
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                {errorMessage && (
                                    <div className="error-message" style={{ color: 'red', textAlign: 'left' }}>
                                        {errorMessage}
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="signin-button" disabled={isLoading}>
                                {isLoading ? (<Spinner size="sm" />) : 'Sign In'}
                            </button>
                        </form>
                    </div>

                    <div className="signup-link">
                        No account yet?{" "}
                        <button onClick={navigateCreateAccount} className="text-button">
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SigninPage;
