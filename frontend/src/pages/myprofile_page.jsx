import React, { useState, useEffect } from 'react';
import './myprofile_page.css';
import { Link } from 'react-router-dom';
import EditProfileTab from '../../src/pages/editprofile_tab';
import Post from './Post';
import { useUser } from '../../src/UserContext';

function MyProfilePage() {
    const { activeusername } = useUser();
    const [userProfile, setUserProfile] = useState({});
    const [isEditProfileTabVisible, setIsEditProfileTabVisible] = useState(false);
    const [posts, setPosts] = useState([]);
    const [favoriteMovies, setFavoriteMovies] = useState([]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`/api/users/profile/${activeusername}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setUserProfile(data);
                setFavoriteMovies(data.favMovies || []); // Update state with favoriteMovies
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        const fetchUserPosts = async () => {
            try {
                const response = await fetch(`/api/posts/byUser/${activeusername}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setPosts(data.posts);
            } catch (error) {
                console.error("Error fetching user's posts:", error);
            }
        };

        fetchUserProfile();
        fetchUserPosts();
    }, [activeusername]);

    const removeMovie = async (movieId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('User is not logged in');
            return;
        }

        try {
            const response = await fetch('/api/users/favoriteMovies/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ movieId }),
            });

            if (!response.ok) {
                throw new Error('Failed to remove movie from favorites');
            }

            setFavoriteMovies(currentMovies => currentMovies.filter(movie => movie.id !== movieId));
        } catch (error) {
            console.error('Error removing movie from favorites:', error);
        }
    };

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
                    <img src={userProfile.banner || 'images/defaultAvatar.jpg'} className="profile_banner" alt={activeusername} />
                    <img src={userProfile.profilepic || 'images/defaultAvatar.jpg'} className="profile_avatar avatar" alt={activeusername} />
                    <div className="profile_name">{activeusername}</div>
                    <div className="profile_bio">{userProfile.bio || 'No bio available'}</div>
                    <button className="button edit_profile" onClick={handleEditProfileClick}>Edit Profile</button>
                </div>

                <div className="post_container">
                    {posts.map((post, index) => (
                        <Post key={index} post={{
                            user: post.postedBy.username,
                            movieId: post.movieId,
                            movie: post.movie,
                            content: post.content,
                            imageUrl: post.imageUrl,
                            timestamp: new Date(post.createdAt).toLocaleDateString()
                        }} />
                    ))}
                </div>

                <div className="favorites_container">
                    <div className="favorites_header">Favorite Movies</div>
                    <div className="favorites_content">
                        {favoriteMovies.map(movie => (
                            <div key={movie.id} className="favorite-container">
                                <button className="close-button" onClick={() => removeMovie(movie.id)}>X</button>
                                <Link to={`/movie/${movie.id}`}>
                                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="profile_movie-poster" />
                                </Link>
                            </div>

                        ))}
                    </div>
                </div>
            </div>

            {isEditProfileTabVisible && <EditProfileTab isVisible={isEditProfileTabVisible} onClose={toggleEditProfileTab} />}
        </div>
    );
}

export default MyProfilePage;
