import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Movie.css'; // Ensure this path matches your file structure

function Movie() {
    const [movieList, setMovieList] = useState([]);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentCategory, setCurrentCategory] = useState('popular');
    const [url, setUrl] = useState('https://api.themoviedb.org/3/movie/popular?api_key=3c4682174e03411b1f2ea9d887d0b8f3');
    const [watchlist, setWatchlist] = useState({});
    const [favorites, setFavorites] = useState({});

    useEffect(() => {
        const fetchWatchlist = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch('/api/users/watchlist', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        const watchlistMap = data.watchlist.reduce((acc, movieId) => {
                            acc[movieId] = true;
                            return acc;
                        }, {});
                        setWatchlist(watchlistMap);
                    } else {
                        throw new Error('Failed to fetch watchlist');
                    }
                } catch (error) {
                    console.error('Error fetching watchlist:', error);
                }
            }
        };

        fetchWatchlist();
    }, []);

    useEffect(() => {
        const fetchFavorites = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch('/api/users/favoriteMovies', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        const favoritesMap = data.favMovies.reduce((acc, movieId) => {
                            acc[movieId] = true;
                            return acc;
                        }, {});
                        setFavorites(favoritesMap);
                    } else {
                        throw new Error('Failed to fetch favorites');
                    }
                } catch (error) {
                    console.error('Error fetching favorites:', error);
                }
            }
        };
    
        fetchFavorites();
    }, []);

    useEffect(() => {
        const getMovie = () => {
            let currentUrl = searchTerm
                ? `https://api.themoviedb.org/3/search/movie?api_key=3c4682174e03411b1f2ea9d887d0b8f3&query=${encodeURIComponent(searchTerm)}`
                : url;

            fetch(`${currentUrl}&page=${page}`)
                .then(response => response.json())
                .then(data => {
                    setMovieList(searchTerm ? data.results : [...movieList, ...data.results]);
                })
                .catch(error => {
                    console.error('Error fetching data: ', error);
                });
        };

        getMovie();
    }, [url, page, searchTerm]);

    const loadMoreMovies = () => {
        if (!searchTerm) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const changeCategory = (newCategory) => {
        if (currentCategory !== newCategory) {
            setUrl(categoryUrls[newCategory]);
            setPage(1);
            setMovieList([]);
            setCurrentCategory(newCategory);
            setSearchTerm('');
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(1);
        setMovieList([]);
    };

    const handleAddToWatchlist = async (movieId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('User is not logged in');
            return;
        }

        if (watchlist[movieId]) {
            alert('Movie is already in watchlist.');
            return;
        }

        try {
            const response = await fetch('/api/users/watchlist/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ movieId }),
            });

            if (!response.ok) {
                throw new Error('Failed to add movie to watchlist');
            }

            setWatchlist(prevWatchlist => ({
                ...prevWatchlist,
                [movieId]: true
            }));

            alert('Movie added to watchlist successfully!');
        } catch (error) {
            console.error('Error adding movie to watchlist:', error);
            alert(error.message);
        }
    };

    const handleAddToFavorites = async (movieId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('User is not logged in');
            return;
        }
        
        if (favorites[movieId]) {
            alert('Movie is already in favorites.');
            return;
        }
    
        if (Object.keys(favorites).length === 6) {
            alert('You have already reached the maximum number of favorite movies.');
            return;
        }

        try {
            const response = await fetch('/api/users/favoriteMovies/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ movieId }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to add movie to favorites');
            }
    
            // Update the state after successfully adding the movie to favorites
            setFavorites(prevFavorites => ({
                ...prevFavorites,
                [movieId]: true // Mark the movie as a favorite
            }));
    
            alert('Movie added to favorites successfully!');
        } catch (error) {
            console.error('Error adding movie to favorites:', error);
            alert(error.message);
        }
    };

    // Define your categoryUrls inside or outside the component
    const categoryUrls = {
        nowPlaying: 'https://api.themoviedb.org/3/movie/now_playing?api_key=3c4682174e03411b1f2ea9d887d0b8f3',
        popular: 'https://api.themoviedb.org/3/movie/popular?api_key=3c4682174e03411b1f2ea9d887d0b8f3',
        toprated: 'https://api.themoviedb.org/3/movie/top_rated?api_key=3c4682174e03411b1f2ea9d887d0b8f3',
        upcoming: `https://api.themoviedb.org/3/discover/movie?api_key=3c4682174e03411b1f2ea9d887d0b8f3&primary_release_date.gte=${new Date().toISOString().split('T')[0]}&sort_by=release_date.asc`,
    };

    return (
        <div className="movie-container">
            <div className="movie_header">
                <h1>Find a Movie</h1>
                <input
                    type="text"
                    placeholder="Search for a movie..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />
                <div className="filter-buttons">
                    {Object.keys(categoryUrls).map(category => (
                        <button key={category} onClick={() => changeCategory(category)}>
                            {category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                        </button>
                    ))}
                </div>
            </div>
            <div className="movie-list">
                {movieList.map(movie => (
                    <div key={movie.id} className="movie-item">
                        <Link to={`/movie/${movie.id}`}>
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                className="movie-image"
                            />
                        </Link>
                        <div className="movie-details">
                            <h3>{movie.title}</h3>
                            <p>Rating: {movie.vote_average}/10</p>
                            <button
                                className={watchlist[movie.id] ? "watchlist-button-added" : "watchlist-button"}
                                onClick={() => handleAddToWatchlist(movie.id)}
                            >
                                {watchlist[movie.id] ? 'Added to Watchlist' : 'Add to Watchlist'}
                            </button>
                            <button
                                className={favorites[movie.id] ? "favorites-button-added" : "favorites-button"}
                                onClick={() => handleAddToFavorites(movie.id)}
                            >
                                {favorites[movie.id] ? 'Added to Favorites' : 'Add to Favorites'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {movieList.length > 0 && !searchTerm && (
                <div className="load-more-container">
                    <button onClick={loadMoreMovies} className="load-more-button">
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
}

export default Movie;
