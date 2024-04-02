import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Nav, NavLink, Bars, NavMenu, LogoutContainer } from "./NavBarElements";
import { FaHome, FaUserFriends, FaList, FaPencilAlt } from "react-icons/fa";
import { IoIosInformationCircle } from "react-icons/io";
import { RiAdminFill } from "react-icons/ri";
import { BiSolidCameraMovie } from "react-icons/bi";
import PostTab from '../../src/pages/PostTab';
import { useUser } from '../../src/UserContext';

const Navbar = () => {
    const navigate = useNavigate(); 
    const { activeusername } = useUser();
    const [userProfile, setUserProfile] = useState({});

    // State to manage the visibility of the PostTab
    const [isPostTabVisible, setIsPostTabVisible] = useState(false);

    // Function to toggle the PostTab visibility
    const togglePostTab = () => {
        setIsPostTabVisible(!isPostTabVisible);
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`/api/users/profile/${activeusername}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setUserProfile(data);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        if (activeusername) {
            fetchUserProfile();
        }
    }, [activeusername]);

    // Function to handle logout
    const handleLogout = async (event) => {
        event.preventDefault();
        try {
            document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            const res = await fetch('/api/users/logout', { method: 'POST' });
            const data = await res.json();
            console.log(data.message);

            localStorage.removeItem("token"); 
            sessionStorage.clear(); 

            navigate('/signin_page'); 
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Function to handle post click
    const handlePostClick = (event) => {
        event.preventDefault();
        togglePostTab();
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
                        People
                    </NavLink>
                    <NavLink to="/watchlist_page">
                        <FaList style={{ marginRight: '8px' }} />
                        Watchlist
                    </NavLink>
                    <NavLink to="/about_page">
                        <IoIosInformationCircle style={{ marginRight: '8px' }} />
                        About
                    </NavLink>
                    {activeusername === 'admin123' && (
                        <NavLink to="/admin_page">
                            <RiAdminFill style={{ marginRight: '8px' }} />
                            Admin Page
                        </NavLink>
                    )}
                    <br></br>
                    <button onClick={handlePostClick} style={{ backgroundColor: "#A949F5", border: 'none', cursor: 'pointer', padding: '10px' }}>
                        <FaPencilAlt style={{ marginRight: '8px' }} />
                        Post
                    </button>
                </NavMenu>

                <LogoutContainer>
                <NavLink to="/myprofile_page">
                    <img 
                        src={userProfile.profilepic ? `http://localhost:4000/${userProfile.profilepic}` : `images/defaultAvatar.jpg`} 
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
                    Logout
                    </button>
                </LogoutContainer>
            </Nav>
            {isPostTabVisible && <PostTab isVisible={isPostTabVisible} onClose={togglePostTab} />}
        </>
    );
};

export default Navbar;
