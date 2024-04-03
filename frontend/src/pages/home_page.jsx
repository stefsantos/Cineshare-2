import React, { useState, useEffect } from 'react';
import Post from './Post';
import './HomePage.css';
import { Link } from 'react-router-dom';

function HomePage() {
    const [posts, setPosts] = useState([]);
    const [currentFilter, setCurrentFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Invoked when `currentFilter` changes.
        handleFetchPosts();
        fetchTrendingMovies();
    }, [currentFilter]);

    useEffect(() => {
        // Invoked when `currentPage` changes, except for the initial render.
        handleFetchPosts();
    }, [currentPage]);

    const handleFetchPosts = async () => {
        // Determine which fetch function to use based on the current filter.
        const fetchFunction = currentFilter === 'all' ? fetchAllPosts : fetchFriendPosts;
        fetchFunction();
    };

    const fetchAllPosts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/posts/allfeed?page=${currentPage}&limit=10`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setPosts(data.feedPosts);
            setHasMore(data.hasMore);
        } catch (error) {
            console.error("Error fetching posts:", error);
            setError("Error fetching posts. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const fetchFriendPosts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/posts/friendfeed?page=${currentPage}&limit=10`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setPosts(data.feedPosts);
            setHasMore(data.hasMore);
        } catch (error) {
            console.error("Error fetching friend posts:", error);
            setError("Error fetching friend posts. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const fetchTrendingMovies = async () => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=YOUR_API_KEY`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setTrendingMovies(data.results);
        } catch (error) {
            console.error("Error fetching trending movies:", error);
        }
    };

    const loadNextPage = () => {
        setCurrentPage(currentPage => currentPage + 1);
    };

    const loadPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage => currentPage - 1);
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
            <div className='filter-buttons'>
                <button onClick={() => { setCurrentFilter('all'); setCurrentPage(1); }} className={currentFilter === 'all' ? 'active' : ''}>
                    All Feed
                </button>
                <button onClick={() => { setCurrentFilter('friends'); setCurrentPage(1); }} className={currentFilter === 'friends' ? 'active' : ''}>
                    Following Feed
                </button>
            </div>
            <div className='homepage'>
                <center>
                    <div className='content'>
                        <div className='userposts'>
                            {loading ? (
                                <p>Loading posts...</p>
                            ) : posts && posts.length > 0 ? (
                                posts.map((post, index) => (
                                    <Post key={index} post={post} />
                                ))
                            ) : (
                                <p>No posts to display.</p>
                            )}
                            <div className="pagination-buttons">
                                {currentPage > 1 && (
                                    <button onClick={loadPreviousPage} className="page-control">
                                        Previous Page
                                    </button>
                                )}
                                {hasMore && (
                                    <button onClick={loadNextPage} className="page-control">
                                        Next Page
                                    </button>
                                )}
                            </div>
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
