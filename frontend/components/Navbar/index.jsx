import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from 'react-router-dom'
import { Nav, NavLink, Bars, NavMenu, LogoutContainer } from "./NavBarElements";
import { FaHome, FaUserFriends, FaList, FaPencilAlt } from "react-icons/fa";
import { BiSolidCameraMovie } from "react-icons/bi";
import PostTab from '../../src/pages/PostTab';
import { useUser } from '../../src/UserContext';

const Navbar = () => {
    const navigate = useNavigate(); // Initialize the useNavigate hook
    const { activeusername } = useUser();
    
    // State to manage the visibility of the PostTab
    const [isPostTabVisible, setIsPostTabVisible] = useState(false);

    // Function to toggle the PostTab visibility
    const togglePostTab = () => {
        setIsPostTabVisible(!isPostTabVisible);
    };

    const handlePostClick = (event) => {
        event.preventDefault();
        togglePostTab();
    };

    // Function to handle logout
    const handleLogout = async (event) => {
        event.preventDefault();
        try {
            await fetch('/api/logout', { method: 'GET' });
            navigate('/signin_page'); // Use navigate to redirect
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <>
            <Nav>
                <Bars />

                <NavMenu>
                    <h3>CineShare 🎥</h3>
                    <NavLink to="/home_page">
                        <FaHome style={{ marginRight: '8px' }} />
                        Home
                    </NavLink>
                    <NavLink to="/Movie">
                        <BiSolidCameraMovie style={{ marginRight: '8px' }} />
                        Movies
                    </NavLink>
                    <NavLink to="/friends_page">
                        <FaUserFriends style={{ marginRight: '8px' }} />
                        Friends
                    </NavLink>
                    <NavLink to="/watchlist_page">
                        <FaList style={{ marginRight: '8px' }} />
                        Watchlist
                    </NavLink>
                    <br></br>
                    <button onClick={handlePostClick} style={{ backgroundColor: "#A949F5", border: 'none', cursor: 'pointer', padding: '10px' }}>
                        <FaPencilAlt style={{ marginRight: '8px' }} />
                        Post
                    </button>
                </NavMenu>

                <LogoutContainer>
                <NavLink to="/myprofile_page">
                    <img 
                        src={activeusername ? `images/${activeusername}.jpg` : `images/defaultAvatar.jpg`} 
                        onError={(e) => { e.target.onerror = null; e.target.src = 'images/defaultAvatar.jpg'; }}
                        height="75"
                        style={{
                            borderRadius: '50%',
                            width: '75px',
                            height: '75px',
                            objectFit: 'cover'
                        }}
                        alt="Profile"
                    />
                </NavLink>


                    <button onClick={handleLogout} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: 'white', fontSize: '20px' }}>
                        ⎗ Logout
                    </button>
                </LogoutContainer>
            </Nav>
            {isPostTabVisible && <PostTab isVisible={isPostTabVisible} onClose={togglePostTab} />}
        </>
    );
};

export default Navbar;
