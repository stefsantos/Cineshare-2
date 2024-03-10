import React, { useState } from 'react';
import './myprofile_page.css';
import { Link, useParams } from 'react-router-dom';
import EditProfileTab from '../../src/pages/editprofile_tab';
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
    const [isEditProfileTabVisible, setIsEditProfileTabVisible] = useState(false);
    const { activeusername } = useUser();
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
        
        fetchTrendingMovies();
    }, []);


    const toggleEditProfileTab = () => {
        setIsEditProfileTabVisible(!isEditProfileTabVisible);
    };

    const handleEditProfileClick = (event) => {
        event.preventDefault();
        toggleEditProfileTab();
    };

    const [posts, setPosts] = React.useState([
        { id: 1, user: username, movie: '(500) Days of Summer', movieId: '19913', content: 'I love 500 days of summer it makes me sad LOL.', timestamp: '2024-22-02' },
        { id: 2, user: username, movie: 'Her', movieId: '152601', content: 'Its so over :((', timestamp: '2024-16-02' },
        { id: 3, user: username, movie: 'The Boy and the Heron', movieId: '508883', content: 'IM TWEAKING RAAHHHHH', timestamp: '2024-11-02' },
        { id: 4, user: username, movie: 'Minecraft: The Story of Mojang', movieId: '151870', content: 'MINEcraft is my favorite game! <3 :D', timestamp: '2024-09-02' },
        { id: 5, user: username, movie: 'About Time', movieId: '122906', content: 'WE ARE SO UP GRAH!', imageUrl: 'https://i.redd.it/t5dmyn6ll49a1.jpg', timestamp: '2024-01-02' },
    ]);

    const isCurrentUser = activeusername === username;

    const renderEditProfileButton = () => {
        if (isCurrentUser==0 && username !== 'Mutahar Anas') {
            return <button className="button edit_profile">✓ Already Friends</button>;
        }

        else if (isCurrentUser==0 && username === 'Mutahar Anas' && activeusername === 'Charles White')
        {
            return <button className="button edit_profile">✓ Already Friends</button>;
        }

        else if (isCurrentUser==0 && username === 'Mutahar Anas' && activeusername !== 'Charles White')
        {
            return <button className="button edit_profile">Send Friend Request</button>;
        }
        
        else {
            return <button className="button edit_profile" onClick={handleEditProfileClick}>Edit Profile</button>;
        }
    };

    return (
            <div className="page">
            <div className="content_container">
            <div className="profile_container">
                {profileAvatars[username] && (
                <img src={profileAvatars[username]} className="profile_banner" alt={username} />
                )}
    
                {profileAvatars[username] && (
                <img src={profileAvatars[username]} className="profile_avatar avatar" alt={username} />
                )}
    
                <div className="profile_name">{username}</div>
                <div className="profile_bio">I am CCS ID 122</div>
    
                {renderEditProfileButton()}

                    
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

            {isEditProfileTabVisible && <EditProfileTab isVisible={isEditProfileTabVisible} onClose={toggleEditProfileTab} />}
        </div>
        
    );
}

export default profile2_page;