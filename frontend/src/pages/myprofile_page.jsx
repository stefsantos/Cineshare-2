import React, { useState, useEffect } from 'react';
import './myprofile_page.css';
import { Link } from 'react-router-dom';
import EditProfileTab from '../../src/pages/editprofile_tab';
import Post from './Post';
import { useUser } from '../../src/UserContext';

function MyProfilePage() {
    const { activeusername } = useUser();
    const [userProfile, setUserProfile] = useState({});
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [isEditProfileTabVisible, setIsEditProfileTabVisible] = useState(false);
    const [posts, setPosts] = useState([
        // Initial posts data
    ]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`/api/users/profile/${activeusername}`); // Adjust the endpoint as necessary
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setUserProfile(data); // Update state with fetched profile data
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        const fetchTrendingMovies = async () => {
            try {
                const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=3c4682174e03411b1f2ea9d887d0b8f3`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTrendingMovies(data.results);
            } catch (error) {
                console.error("Error fetching trending movies:", error);
            }
        };

        fetchUserProfile();
        fetchTrendingMovies();
    }, [activeusername]); // This effect depends on activeusername and runs on mount and whenever activeusername changes

    

    const toggleEditProfileTab = () => {
        setIsEditProfileTabVisible(!isEditProfileTabVisible);
    };

    const handleEditProfileClick = (event) => {
        event.preventDefault();
        toggleEditProfileTab();
    };

    return (
        <div className="page">
            <div className="content_container">
                <div className="profile_container">
                    <img src={userProfile.profilepic || 'images/defaultAvatar.jpg'} className="profile_banner" alt={activeusername} />
                    <img src={userProfile.profilepic || 'images/defaultAvatar.jpg'} className="profile_avatar avatar" alt={activeusername} />
                    <div className="profile_name">
                        {activeusername}
                    </div>
                    <div className="profile_bio">
                        {userProfile.bio || 'No bio available'} {/* Fallback text in case bio is empty */}
                    </div>
                    <button className="button edit_profile" onClick={handleEditProfileClick}>
                        Edit Profile
                    </button>
                </div>
                
                <div className="post_container">
                    {posts.map(post => (
                        <Post key={post.id} post={post} />
                    ))}
                </div>

                <div className="favorites_container">
                    <div className="favorites_header">
                        Top 6 Favorites
                    </div>
                    <div className="favorites_content">
                        {trendingMovies.slice(0, 6).map(movie => (
                            <Link to={`/movie/${movie.id}`} key={movie.id}>
                                <img
                                    className="profile_movie-poster"
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {isEditProfileTabVisible && <EditProfileTab isVisible={isEditProfileTabVisible} onClose={toggleEditProfileTab} />}
        </div>
    );
}

export default MyProfilePage;
