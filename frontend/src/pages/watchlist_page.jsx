import React, { useEffect, useState } from 'react';
import './watchlist_page.css';
import { Link } from 'react-router-dom';

function Watchlist() {
    const [movieList, setMovieList] = useState([]);
    const [message, setMessage] = useState('');


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

    const removeMovie = async (movieId) => {
      const token = localStorage.getItem('token');
      if (!token) {
          console.log('User is not logged in');
          return;
      }
  
      try {
          const response = await fetch('/api/users/watchlist/delete', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({ movieId }),
          });
  
          if (!response.ok) {
              throw new Error('Failed to remove movie from watchlist');
          }
  
          // Find the movie's title for the message
          const movie = movieList.find(m => m.id === movieId);
          const movieTitle = movie ? movie.title : 'The movie';
  
          // Refresh the watchlist or filter out the movie from the local state
          setMovieList(currentMovieList => currentMovieList.filter(movie => movie.id !== movieId));
  
          // Set message
          setMessage(`${movieTitle} removed from watchlist`);
  
          // Optionally clear the message after a few seconds
          setTimeout(() => setMessage(''), 3000);
      } catch (error) {
          console.error('Error removing movie from watchlist:', error);
          setMessage('Failed to remove movie from watchlist'); // Set error message
          setTimeout(() => setMessage(''), 3000); // Clear the message after a few seconds
      }
  };
  
  

  return (
    <center>
        <div className="movie-list-container">
            <h1>Watchlist</h1>
            {message && <p className="message">{message}</p>} {/* Display the message here */}
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
