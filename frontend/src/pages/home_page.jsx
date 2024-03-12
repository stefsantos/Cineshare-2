import React, { useState, useEffect } from 'react';
import Post from './Post';
import './HomePage.css';
import { Link } from 'react-router-dom';

function HomePage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAllPosts();
        fetchTrendingMovies();
    }, []);

    const fetchAllPosts = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/posts/allfeed');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setPosts(data.feedPosts);
        } catch (error) {
            console.error("Error fetching posts:", error);
            setError("Error fetching posts. Please try again later.");
        } finally {
            setLoading(false);
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

    if (error) {
        return <div>Error: {error}</div>;
    }

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
                                posts.map((post, index) => (
                                    <Post key={index} post={{
                                        user: post.postedBy ? post.postedBy.username : 'Unknown',
                                        movieId: post.movieId,
                                        movie: post.movie,
                                        content: post.content,
                                        imageUrl: post.imageUrl,
                                        timestamp: new Date(post.createdAt).toLocaleDateString() // Adjust the date format as per your needs
                                    }} />
                                ))
                            )}
                        </div>
                        <div className='rightsidebar'>
                            <div className='sidetitle'>🔥Popular Movies</div>
                            <div className='sidebarcontent'>
                                {trendingMovies.map(movie => (
                                    <Link to={`/movie/${movie.id}`} key={movie.id}>
                                        <img
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
