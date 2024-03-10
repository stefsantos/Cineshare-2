import React, { useState, useLayoutEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useToast, Spinner } from "@chakra-ui/react"; // Ensure Spinner is imported
import { useUser } from '../../src/UserContext';
import './signin_page.css';
import logo from '../assets/CineShare Logo Request.webp';

function SigninPage({ setShowNavbar }) {
    const navigate = useNavigate();
    const toast = useToast();
    const userContext = useUser();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Use for tracking loading state

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
        setIsLoading(true); // Start loading
        try {
            const res = await fetch("/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                throw new Error('Server responded with a status: ' + res.status);
            }

            const data = await res.json();

            if (data.error) {
                toast({
                    title: "Error",
                    description: data.error,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                userContext.updateUser(data.username);
                navigateHome();
                localStorage.setItem("user-info", JSON.stringify(data));
            }
        } catch (error) {
            console.error('An error occurred:', error);
            toast({
                title: "Error",
                description: error.toString(),
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false); // End loading
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
