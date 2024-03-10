import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Movie.css'; // Make sure this path is correct

function Movie() {
    const [movieList, setMovieList] = useState([]);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentCategory, setCurrentCategory] = useState('popular');
    const [url, setUrl] = useState('https://api.themoviedb.org/3/movie/popular?api_key=3c4682174e03411b1f2ea9d887d0b8f3');
    const [watchlist, setWatchlist] = useState({});

    // Get today's date in YYYY-MM-DD format for API query
    const today = new Date().toISOString().split('T')[0];

    const categoryUrls = {
        nowPlaying: 'https://api.themoviedb.org/3/movie/now_playing?api_key=3c4682174e03411b1f2ea9d887d0b8f3',
        popular: 'https://api.themoviedb.org/3/movie/popular?api_key=3c4682174e03411b1f2ea9d887d0b8f3',
        toprated: 'https://api.themoviedb.org/3/movie/top_rated?api_key=3c4682174e03411b1f2ea9d887d0b8f3',
        upcoming: `https://api.themoviedb.org/3/discover/movie?api_key=3c4682174e03411b1f2ea9d887d0b8f3&primary_release_date.gte=${today}&sort_by=release_date.asc`
    };

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

    const handleAddToWatchlist = (movieId) => {
        setWatchlist(prevWatchlist => ({
            ...prevWatchlist,
            [movieId]: !prevWatchlist[movieId]
        }));
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
                    <button onClick={() => changeCategory('nowPlaying')}>Now Playing</button>
                    <button onClick={() => changeCategory('popular')}>Popular</button>
                    <button onClick={() => changeCategory('toprated')}>Top Rated</button>
                    <button onClick={() => changeCategory('upcoming')}>Upcoming</button>
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
