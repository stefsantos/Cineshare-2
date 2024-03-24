import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MovieDetail.css';
import Post from '../src/pages/Post';

function MovieDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [movieDetails, setMovieDetails] = useState(JSON.parse(localStorage.getItem(`movieDetails-${id}`)) || null);
    const [isAddedToWatchlist, setIsAddedToWatchlist] = useState(false);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const checkWatchlistAndFetchDetails = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/signin_page');
                return;
            }

            try {
                // Check if movie is in the watchlist
                let response = await fetch('/api/users/watchlist/check', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ movieId: id }),
                });

                if (!response.ok) {
                    throw new Error('Failed to check watchlist');
                }

                const { isInWatchlist } = await response.json();
                setIsAddedToWatchlist(isInWatchlist);

                // Fetch movie details if not already in state
                if (!movieDetails) {
                    const detailsResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=3c4682174e03411b1f2ea9d887d0b8f3`);
                    const detailsData = await detailsResponse.json();
                    const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=3c4682174e03411b1f2ea9d887d0b8f3`);
                    const creditsData = await creditsResponse.json();

                    const combinedDetails = {
                        ...detailsData,
                        director: creditsData.crew.find(person => person.job === 'Director')?.name,
                    };

                    setMovieDetails(combinedDetails);
                    localStorage.setItem(`movieDetails-${id}`, JSON.stringify(combinedDetails));
                }
            } catch (error) {
                console.error('Error:', error);
            }
            await getPostsForMovie();
        };


        checkWatchlistAndFetchDetails();
    }, [id, movieDetails, navigate]);


    const getPostsForMovie = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/signin_page');
            return;
        }
    
        try {
            const response = await fetch(`/api/posts/movie/${id}`, { 
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const postsData = await response.json();
            setPosts(postsData); 
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const renderStarRating = (score) => {
        const rating = Math.round(score / 20); // Convert to a 5-star rating
        return (
            <>
                {'★'.repeat(rating)}
                {'☆'.repeat(5 - rating)}
            </>
        );
    };

    const handleBack = () => {
        navigate(-1); // Navigates back to the previous page
    };

    const addToWatchlist = async () => {
        if (isAddedToWatchlist) {
            alert('Movie is already in watchlist.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/signin_page');
            return;
        }

        try {
            const response = await fetch('/api/users/watchlist/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ movieId: id }),
            });

            if (!response.ok) {
                throw new Error('Failed to add movie to watchlist');
            }

            alert('Movie added to watchlist successfully!');
            setIsAddedToWatchlist(true);
        } catch (error) {
            console.error('Error adding movie to watchlist:', error);
            alert(error.message);
        }
    };

    const renderPosts = () => (
        <div>
            <h2>Related Posts</h2>
            {posts.length > 0 ? (
                posts.map(post => <Post key={post._id} post={post} />)
            ) : (
                <p>No related posts available.</p>
            )}
        </div>
    );

    return (
        <div>
            {movieDetails && (
                <div style={{ display: 'flex', alignItems: 'center', margin: '20px' }}>
                    <div>
                        <img 
                            src={`https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`} 
                            alt={movieDetails.title} 
                            width='400px' 
                            height='600px' 
                        />
                    </div>
                    <div style={{ marginLeft: '20px' }}>
                        <h1>{movieDetails.title} ({movieDetails.release_date?.split('-')[0]})</h1>
                        <p>{movieDetails.overview}</p>
                        {movieDetails.director && <p>Director: {movieDetails.director}</p>}
                        <p>User Score: {renderStarRating(movieDetails.vote_average * 10)}</p>
                    </div>
                </div>
            )}
            
            <button onClick={handleBack} style={{ marginTop: '10px', marginLeft: '20px', color: 'white'}}>Back</button>
            <button onClick={addToWatchlist} className={isAddedToWatchlist ? "watchlist-button-added" : "watchlist-button"}>
                {isAddedToWatchlist ? 'Added to Watchlist' : 'Add to Watchlist'}
            </button>
            {renderPosts()}
        </div>
    );
}

export default MovieDetail;
