import React, { useState } from 'react';
import { Nav, NavLink, Bars, NavMenu, LogoutContainer } from "./NavBarElements";
import { FaHome, FaUserFriends, FaList, FaPencilAlt } from "react-icons/fa";
import { BiSolidCameraMovie } from "react-icons/bi";
import PostTab from '../../src/pages/PostTab';
import { useUser } from '../../src/UserContext';

const Navbar = () => {
    
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
                    <button to="#" onClick={handlePostClick} style = {{  backgroundColor: "#A949F5"}}>
                        <FaPencilAlt style={{ marginRight: '8px' }} />
                        Post
                    </button>
                    
                </NavMenu>

                <LogoutContainer>
                <NavLink to="myprofile_page">
                {activeusername === 'Yco Santos' && (
                    <img src="images/yco.png" height="75"
                        style={{
                            borderRadius: '50%',
                            width: '75px',
                            height: '75px',
                            objectFit: 'cover'
                        }}
                        alt="Yco Santos Profile"
                    />
                )}
                {activeusername === 'Austin Gan' && (
                    <img src="images/austin.jpg" height="75"
                        style={{
                            borderRadius: '50%',
                            width: '75px',
                            height: '75px',
                            objectFit: 'cover'
                        }}
                        alt="Austin Tan Profile"
                    />
                )}
                {activeusername === 'Philipp Matthew Suarez' && (
                    <img src="images/philipp.jpg" height="75"
                        style={{
                            borderRadius: '50%',
                            width: '75px',
                            height: '75px',
                            objectFit: 'cover'
                        }}
                        alt="Philipp Matthew Suarez Profile"
                    />
                )}
                {activeusername === 'Javi del Rosario' && (
                    <img src="images/javi.jpg" height="75"
                        style={{
                            borderRadius: '50%',
                            width: '75px',
                            height: '75px',
                            objectFit: 'cover'
                        }}
                        alt="Javi del Rosario Profile"
                    />
                )}
                {activeusername === 'Charles White' && (
                    <img src="images/moist.png" height="75"
                        style={{
                            borderRadius: '50%',
                            width: '75px',
                            height: '75px',
                            objectFit: 'cover'
                        }}
                        alt="Charles White Profile"
                    />
                )}
                 {activeusername === 'Mutahar Anas' && (
                    <img src="images/muta.png" height="75"
                        style={{
                            borderRadius: '50%',
                            width: '75px',
                            height: '75px',
                            objectFit: 'cover'
                        }}
                        alt="Mutahar Anas Profile"
                    />
                )}
            </NavLink>
                    <NavLink to="signin_page">
                       ⎗ Logout
                    </NavLink>
                </LogoutContainer>
            </Nav>
            {isPostTabVisible && <PostTab isVisible={isPostTabVisible} onClose={togglePostTab} />}
        </>
    );
};

export default Navbar;
