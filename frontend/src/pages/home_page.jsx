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
        // Reset pagination and posts when changing filter
        setPosts([]);
        setCurrentPage(1);
        setHasMore(true);

        if (currentFilter === 'all') {
            fetchAllPosts();
        } else if (currentFilter === 'friends') {
            fetchFriendPosts();
        } else {
            fetchAllPosts();
        }
        fetchTrendingMovies();
    }, [currentFilter]); // Re-fetch posts when the currentFilter changes

    const fetchAllPosts = async (page = currentPage) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/posts/allfeed?page=${page}&limit=10`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (page > 1) {
                setPosts(prev => [...prev, ...data.feedPosts]);
            } else {
                setPosts(data.feedPosts);
            }
            setHasMore(data.hasMore); 
            console.log(data);
        } catch (error) {
            console.error("Error fetching posts:", error);
            setError("Error fetching posts. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const fetchFriendPosts = async (page = currentPage) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/posts/friendfeed?page=${page}&limit=10`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (page > 1) {
                setPosts(prev => [...prev, ...data.feedPosts]);
            } else {
                setPosts(data.feedPosts);
            }
            setHasMore(data.hasMore); 
            console.log(data);
        } catch (error) {
            console.error("Error fetching friend posts:", error);
            setError("Error fetching friend posts. Please try again later.");
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

    const loadMorePosts = () => {
        // Save current scroll position
        const currentScrollPosition = window.scrollY;
    
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
    
        const fetchPosts = currentFilter === 'all' ? fetchAllPosts : fetchFriendPosts;
        fetchPosts(nextPage).then(() => {
            setTimeout(() => {
                window.scrollTo(0, currentScrollPosition);
            }, 100); 
        });
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
                <button onClick={() => setCurrentFilter('all')} className={currentFilter === 'all' ? 'active' : ''}>
                    All Feed
                </button>
                <button onClick={() => setCurrentFilter('friends')} className={currentFilter === 'friends' ? 'active' : ''}>
                    Following Feed
                </button>
            </div>
            <div className='homepage'>
                <center>
                    <div className='content'>
                    <div className='userposts'>
                        <div className="filter-buttons">   
                        {currentFilter !== 'friends' && (
                            <>
                                <button onClick={() => setCurrentFilter('popular')} className={currentFilter === 'popular' ? 'active' : ''}>
                                    Most Popular
                                </button>
                                <button onClick={() => setCurrentFilter('all')} className={currentFilter === 'all' ? 'active' : ''}>
                                    Most Recent
                                </button>
                            </>
                        )}
                        </div>
                        {loading ? (
                            <p>Loading posts...</p>
                        ) : (
                            (currentFilter !== 'all' && posts.length <= 0) ? (
                                <p>You are not following anyone that has posted.</p>
                            ) : (
                                currentFilter === 'popular' ? (
                                    posts && posts.length > 0 ? (
                                        posts
                                            .slice() 
                                            .sort((a, b) => b.likes.length - a.likes.length) 
                                            .map((post, index) => (
                                                <Post key={index} post={{
                                                    _id: post._id,
                                                    user: post.postedBy ? post.postedBy.username : 'deleteduser',
                                                    movieId: post.movieId,
                                                    movie: post.movie,
                                                    content: post.content,
                                                    imageUrl: post.imageUrl,
                                                    timestamp: new Date(post.createdAt).toLocaleString('en-US', {
                                                        month: 'short',
                                                        day: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        second: '2-digit',
                                                        hour12: true,
                                                    }),
                                                    isFlagged: post.isFlagged
                                                }} />
                                            ))
                                    ) : (
                                        <p>No posts to display.</p>
                                    )
                                ) : (
                                    posts && posts.length > 0 ? (
                                        posts.map((post, index) => (
                                            <Post key={index} post={{
                                                _id: post._id,
                                                user: post.postedBy ? post.postedBy.username : 'deleteduser',
                                                movieId: post.movieId,
                                                movie: post.movie,
                                                content: post.content,
                                                imageUrl: post.imageUrl,
                                                timestamp: new Date(post.createdAt).toLocaleString('en-US', {
                                                    month: 'short',
                                                    day: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit',
                                                    hour12: true,
                                                }),
                                                isFlagged: post.isFlagged
                                            }} />
                                        ))
                                    ) : (
                                        <p>No posts to display.</p>
                                    )
                                )
                            )
                        )}
                        {hasMore && (
                            <button onClick={loadMorePosts} className="load-more-home-button">
                                Load More
                            </button>
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
