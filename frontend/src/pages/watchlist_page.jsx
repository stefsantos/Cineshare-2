import React, { useEffect, useState } from 'react';
import './watchlist_page.css';
import { Link } from 'react-router-dom';

function Movie() {
  const [movieList, setMovieList] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentCategory, setCurrentCategory] = useState('popular');
  const [url, setUrl] = useState('https://api.themoviedb.org/3/movie/popular?api_key=3c4682174e03411b1f2ea9d887d0b8f3');

  useEffect(() => {
    const getMovie = () => {
      let currentUrl = searchTerm
          ? `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${encodeURIComponent(searchTerm)}`
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

  const removeMovie = (id) => {
    setMovieList(movieList.filter(movie => movie.id !== id));
  };

  const loadMoreMovies = () => {
    if (!searchTerm) {
        setPage(prevPage => prevPage + 1);
    }
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

export default Movie;
 