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
    const [favoriteMovies, setFavoriteMovies] = useState([{ id: "1096197" }, {id:"438631"}, {id:"787699"}]);
    
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`/api/users/profile/${activeusername}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setUserProfile(data);
                const favoriteMovies = data.favMovies.map(id => ({ id }));
                
                setUserProfile(data);
                setFavoriteMovies(favoriteMovies);
                console.log("FavMovies test:", favoriteMovies);
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

        const fetchMoviePoster = async (movieId) => {
            try {
                const apiKey = '3c4682174e03411b1f2ea9d887d0b8f3';
                const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const posterPath = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
                console.log("Poster Path:", posterPath);
                return posterPath;
            } catch (error) {
                console.error("Error fetching movie poster:", error);
                return null;
            }
        };
        
        const fetchMoviePosters = async () => {
            const updatedMovies = await Promise.all(
                favoriteMovies.map(async (movie) => {
                    const posterPath = await fetchMoviePoster(movie.id);
                    console.log("Movie ID:", movie.id, "Poster Path:", posterPath);
                    return { ...movie, poster_path: posterPath };
                })
            );
            console.log("Updated Movies:", updatedMovies);
            setFavoriteMovies(updatedMovies);
        };

        fetchUserProfile();
        fetchUserPosts();
        fetchMoviePosters(); //this is somehow getting executed first before profile thats why no picture

    }, [activeusername]);

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
                            <Link to={`/movie/${movie.id}`} key={movie.id}>
                                <img className="profile_movie-poster" src={movie.poster_path || 'placeholder.jpg'} alt={movie.title} />
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
