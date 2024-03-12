import React from 'react';
import Post from './Post';
import './HomePage.css';
import { Link } from 'react-router-dom';
import {useState, useEffect} from 'react';



function HomePage() {
    
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [trendingMovies, setTrendingMovies] = useState([]);

    useEffect(() => {
        fetchTrendingMovies();
        fetchFollowedUsersPosts();
    }, []);

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

    const fetchFollowedUsersPosts = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/posts/friendfeed'); 
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };
    
    
    
    return (
        <>
            <div className='title'>
                <h1>CineShare</h1>
                <h2>Home</h2>
            </div>
            
            <div className='homepage'>
                <center>
                <div className='content'>
                    <div className='userposts'>
                        {loading ? (
                            <p>Loading posts...</p>
                        ) : (
                            posts.map(post => (
                                <Post key={post.id} post={post} />
                            ))
                        )}
                    </div>
                    <div className='rightsidebar'>
                        <div className='sidetitle'>🔥Popular Movies</div>
                        <div className='sidebarcontent'>
                        {trendingMovies.map(movie => (
                            <Link to={`/movie/${movie.id}`} key={movie.id}>
                            <img
                                key={movie.id}
                                className="home_movie-poster"
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                            />
                            </Link>
                        ))}
                        </div>
                    </div>
                    
                </div>
                </center>
            </div>
        </>
    );
}

export default HomePage;
