import React, { useState, useEffect } from "react";
import "./searchTab.css";
import { Link } from 'react-router-dom';
import { useUser } from '../../src/UserContext';

const searchTab = ({ isVisible, onClose }) => {
    if (!isVisible) return null;
    const [searchUsername, setsearchUsername] = useState({});
    const [showSearchResult, setShowSearchResult] = useState(false);
    const { activeusername } = useUser();

    const handleInputChange = (event) => {
        setsearchUsername(event.target.value);
        setShowSearchResult(false);
    };

    const handleSearch = () => {
        console.log("Search for username:", searchUsername);

        if (searchUsername._id == null || activeusername === searchUsername.username)
        {
            console.log(searchUsername._id);
            setShowSearchResult(false);
        }

        else
        {
            console.log(searchUsername._id);
            setShowSearchResult(true);
        }
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`/api/users/profile/${searchUsername}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setsearchUsername(data);
                console.log("Searching User: ", data);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchUserProfile();
    })

    return (
        <div className="search-modal-backdrop">
        <div className="search-modal">
            <div className="search-modal-header">
            <h2>Search for a User</h2>
            <button className="close-button" onClick={onClose}>&times;</button>
            </div>
            <div className="search-modal-content">
                <textarea
                    className="modal-input"
                    placeholder="Enter Username..."
                    onChange={handleInputChange}
                ></textarea>

                {showSearchResult && (
                    <div className="search-container">
                        <img
                           src={searchUsername.profilepic ? `images/${searchUsername.profilepic}.jpg` : `images/defaultAvatar.jpg`}
                            alt="Avatar"
                            className="search_avatar"
                        />

                        <div className="search_text">
                            <div className="search_name">{searchUsername.username}</div>
                        </div>

                        <Link to={`/profile/${searchUsername.username}`} className="search-visit-button">Visit</Link>
                    </div>
                )}
            </div>
            <div className="search-modal-footer">
                <button className="button cancel-button" onClick={onClose}>Cancel</button>
                <button className="button create-button" onClick={handleSearch}>Search</button>
            </div>
        </div>
        </div>
    );
};

export default searchTab;
