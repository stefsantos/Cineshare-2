import React, { useState, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './createacct_page.css';
import logo from '../assets/CineShare Logo Request.webp';
import { useToast, Spinner } from "@chakra-ui/react";

function CreateAcctPage({ setShowNavbar }) {
    const navigate = useNavigate();
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const [errorMessage, setErrorMessage] = useState(null);

    const navigateSignIn = () => {
        navigate('/signin_page');
        setShowNavbar(true);
    };

    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
    });


    const handleSignUp = async (event) => {
        event.preventDefault();
        setIsLoading(true);
    
        if (inputs.password !== confirmPassword) {
            setIsLoading(false);
            setPasswordError(true);
            setErrorMessage("Passwords do not match");
            return;
        } else {
            setPasswordError(false);
            setErrorMessage(null);
        }
    
        try {
            const res = await fetch("/api/users/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(inputs)
            });
            console.log(res);
            if (!res.ok) {
                if (res.status === 400) {
                    setErrorMessage("Username/Email is already in use");
                } else {
                    throw new Error('Server responded with a status: ' + res.status);
                }
            } else {
                let data = await res.json();
    
                if (data.error) {
                    setErrorMessage(data.error);
                } else {
                    navigateSignIn();
                    localStorage.setItem("user-info", JSON.stringify(data));
                }
            }
        } catch (error) {
                setErrorMessage("An error has occurred");
        } finally {
            setIsLoading(false);
        }
    };

    useLayoutEffect(() => {
        setShowNavbar(false);
    }, []);

    return (
        <div className="create-account-fullscreen">
            <div className="create-account-side-bar">
                <img src={logo} alt="logo" height="400px" width="400px" />
            </div>
            <div className="create-account-container">
                <div className="signup-container">
                    <h2>Create Account</h2>
                    <form className="signup-form" onSubmit={handleSignUp}>
                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                value={inputs.username}
                                onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={inputs.email}
                                onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                                placeholder="example@gmail.com"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={inputs.password}
                                onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        {errorMessage && (
                            <div style={{ color: 'red', textAlign: 'left'}}>{errorMessage}</div>
                        )}
                        </div>
                        <button type="submit" className="signup-button" disabled={isLoading}>
                            {isLoading ? <Spinner /> : 'Create Account'}
                        </button>
                    </form>
                    <div className="signin-link">
                        Already have an account?{" "}
                        <button onClick={navigateSignIn} className="text-button">
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateAcctPage;
