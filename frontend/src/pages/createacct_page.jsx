import React, { useState, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './createacct_page.css';
import logo from '../assets/CineShare Logo Request.webp';
import { useToast, Spinner } from "@chakra-ui/react";

function CreateAcctPage({ setShowNavbar }) {
    const navigate = useNavigate();
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false); // New state for password error
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

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
            setIsLoading(false); // Stop the loading animation
            setPasswordError(true); // Set password error state to true
            toast({
                title: "Error",
                description: "Passwords do not match",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        } else {
            setPasswordError(false); // Ensure password error is cleared if they now match
        }

        try {
            const res = await fetch("/api/users/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(inputs)
            });

            if (!res.ok) {
                throw new Error('Server responded with a status: ' + res.status);
            }

            let data = await res.json();

            if (data.error) {
                toast({
                    title: "Error",
                    description: data.error,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                navigateSignIn();
                localStorage.setItem("user-info", JSON.stringify(data));
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error.toString(),
                status: "error",
                duration: 3000,
                isClosable: true,
            });
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
                        </div>
                        {passwordError && (
                            <div style={{ color: 'red', marginTop: '10px' }}>Passwords do not match.</div>
                        )}
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
