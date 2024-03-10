import React, { useState, useLayoutEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { useUser } from '../../src/UserContext';
import './signin_page.css'; 
import logo from '../assets/CineShare Logo Request.webp';

function SigninPage({ setShowNavbar }) {
    const navigate = useNavigate();
    const toast = useToast();
    const userContext = useUser();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
        
        try {
            const res = await fetch("/api/users/signin", {
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
                    <form className="login-form" onSubmit={handleLogin}>
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
                        <button onClick= {navigateHome} type="submit" className="signin-button">Sign In</button>
                    </form>
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