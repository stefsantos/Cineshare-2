import React, { useEffect, useState } from 'react';
import './watchlist_page.css';
import { Link } from 'react-router-dom';

function Watchlist() {
    const [movieList, setMovieList] = useState([]);

    useEffect(() => {
        const fetchWatchlistMovies = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('User is not logged in');
                return;
            }

            try {
                const watchlistResponse = await fetch('/api/users/watchlist', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (watchlistResponse.ok) {
                    const data = await watchlistResponse.json();
                    fetchMovieDetails(data.watchlist);
                } else {
                    throw new Error('Failed to fetch watchlist');
                }
            } catch (error) {
                console.error('Error fetching watchlist:', error);
            }
        };

        fetchWatchlistMovies();
    }, []);

    const fetchMovieDetails = async (watchlist) => {
        const movieDetailsPromises = watchlist.map(movieId =>
            fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=3c4682174e03411b1f2ea9d887d0b8f3`)
                .then(response => response.json())
        );

        Promise.all(movieDetailsPromises)
            .then(movieDetails => {
                setMovieList(movieDetails.filter(movie => !movie.status_code)); // Filter out any potential errors
            })
            .catch(error => {
                console.error('Error fetching movie details:', error);
            });
    };

    const removeMovie = (id) => {
        setMovieList(movieList.filter(movie => movie.id !== id));
    };

    return (
        <center>
            <div className="movie-list-container">
                <h1>Watchlist</h1>
                <div className="movie-cards-container">
                    {movieList.map(movie => (
                        <div key={movie.id} className="movie-card">
                            <button className="close-button" onClick={() => removeMovie(movie.id)}>X</button>
                            <Link to={`/movie/${movie.id}`}>
                                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                            </Link>
                            <div className="movie-card-details">
                                <h3>{movie.title}</h3>
                                <p>Rating: {movie.vote_average}/10</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </center>
    );
}

export default Watchlist;
