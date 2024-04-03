import React, { useState, useEffect } from 'react';
import './myprofile_page.css';
import { Link, useParams } from 'react-router-dom';
import Post from './Post';
import { useUser } from '../../src/UserContext';

const profileAvatars = {
    'Yco Santos': '../images/yco.png',
    'Austin Gan': '../images/austin.jpg',
    'Philipp Matthew Suarez': '../images/philipp.jpg',
    'Javi del Rosario': '../images/javi.jpg',
    'Charles White': '../images/moist.png',
    'Mutahar Anas': '../images/muta.png',
  };

  function profile2_page() {
    const [trendingMovies, setTrendingMovies] = React.useState([]);
    const { username } = useParams();
    const { activeusername } = useUser();
    const [userProfile, setUserProfile] = useState({});
    const [activeProfile, setActiveProfile] = useState({});
    const [isFollowing, setIsFollowing] = useState(true);
    console.log('Username:', username);
    console.log('Active Username:', activeusername);

    React.useEffect(() => {
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

        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`/api/users/profile/${username}`); 
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log("user: ", data);
                setUserProfile(data); 
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        const fetchUserPosts = async () => {
            try {
                const response = await fetch(`/api/posts/byUser/${username}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setPosts(data.posts);
            } catch (error) {
                console.error("Error fetching user's posts:", error);
            }
        };

        const fetchActiveProfile = async () => {
            try {
                const response = await fetch(`/api/users/profile/${activeusername}`); 
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log("user: ", data);
                setActiveProfile(data); 
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };
        
        fetchActiveProfile();
        fetchUserProfile();
        fetchUserPosts();
        fetchTrendingMovies();
    }, []);


    
    const [posts, setPosts] = React.useState([
       
    ]);

    useEffect(() => {
        setIsFollowing(userProfile.followers && userProfile.followers.includes(activeProfile._id));
        console.log("Set: ", isFollowing);
    }, [userProfile, activeProfile]);

    const renderOtherProfileButton = () => {
        return <button className="button edit_profile" onClick={handleFollowUnfollow}>
                    {isFollowing ? (
                        <>
                            <span className="follow-status">Unfollow</span>
                        </>
                    ) : (
                        <>
                            <span className="follow-status">Follow</span>
                        </>
                    )}
                </button>
    };

    const handleFollowUnfollow = async() => {
        try {
            const res = await fetch(`/api/users/follow/${userProfile._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            })

            const data = await res.json();
            setIsFollowing(!isFollowing);
            console.log(data);

            if (data.error) 
            {
                console.log("Error");
            }

        } catch (error) {
            console.log("Error");
        }
    }

    return (
        <div className="page">
            <div className="content_container">
                <div className="profile_container">
                    <img src={userProfile.banner ? `https://cineshare-51j1.onrender.com/${userProfile.banner}` : '/images/defaultBanner.jpg'} className="profile_banner" alt={activeusername} />
                    <img src={userProfile.profilepic ? `https://cineshare-51j1.onrender.com/${userProfile.profilepic}` : '/images/defaultAvatar.jpg'} className="profile_avatar avatar" alt={activeusername} />

                    <div className="profile_name">{username}</div>
                    <div className="profile_bio">{userProfile.bio || 'No bio available'}</div>
        
                    {renderOtherProfileButton()}
                </div>
                
                <div className="post_container">
                    {posts.length > 0 ? (
                        posts.map((post, index) => (
                            <Post key={index} post={{
                                _id: post._id,
                                user: post.postedBy.username,
                                movieId: post.movieId,
                                movie: post.movie,
                                content: post.content,
                                imageUrl: post.imageUrl,
                                timestamp: new Date(post.createdAt).toLocaleDateString(),
                            }} />
                        ))
                    ) : (
                        <p>User has not posted.</p>
                    )}
                </div>

                <div className="favorites_container">
                    <div className="favorites_header">
                        Top 6 Favorites
                    </div>

                    <div className="favorites_content">
                        {trendingMovies.slice(0,6).map(movie => (
                            <Link to={`/movie/${movie.id}`} key={movie.id}>
                            <img
                                key={movie.id}
                                className="movie-poster"
                                style={{ width: '111px', height: '150px', margin: '10px', boxShadow: '0px 0px 5px rgba(255, 255, 255, 0.5)'  }}
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                            />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        
    );
}

export default profile2_page;