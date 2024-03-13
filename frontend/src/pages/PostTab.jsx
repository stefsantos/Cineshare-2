import React, { useState, useEffect } from "react";
import "./PostTab.css";
import { useUser } from '../UserContext';

const PostTab = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  const { userId } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState('');
  const [selectedMovieTitle, setSelectedMovieTitle] = useState('');
  const [postText, setPostText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreatePost = async () => {
    if (!postText.trim() || !selectedMovieId) {
      setError('Please provide both a movie and your thoughts.');
      return;
    }

    setIsLoading(true);
    setError('');

    const postBody = JSON.stringify({
      content: postText.trim(),
      movie: selectedMovieTitle,
      movieId: selectedMovieId,
      // You might need to adjust handling for the user ID and image URL depending on your backend
      // postedBy: userId, // Consider handling user identification on the server-side
    });

    try {
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include authorization headers if required
        },
        body: postBody,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create post');
      }


      const data = await response.json();
      console.log('Post created:', data);
      onClose(); // Optionally close the modal on successful creation
    } catch (error) {
      setError(error.message || 'An error occurred while creating the post.');
      console.error('Error creating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchMovies = async () => {
      if (searchTerm.length > 2) {
        try {
          const apiKey = '3c4682174e03411b1f2ea9d887d0b8f3'; // Use your actual API key
          const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchTerm)}`;
          const response = await fetch(url);
          const data = await response.json();
          setSuggestions(data.results);
        } catch (error) {
          console.error('Error fetching movie suggestions:', error);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchMovies();
  }, [searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const selectMovie = (movie) => {
    setSearchTerm(movie.title);
    setSelectedMovieId(movie.id);
    setSelectedMovieTitle(movie.title);
    setSuggestions([]);
  };

  const handlePostTextChange = (event) => {
    setPostText(event.target.value);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>Create a New Post</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-content">
          <input
            className="modal-input"
            type="text"
            placeholder="Movie Watched"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map(movie => (
                <li key={movie.id} onClick={() => selectMovie(movie)} className="suggestion-item">
                  <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt={movie.title} className="suggestion-poster" />
                  {movie.title}
                </li>
              ))}
            </ul>
          )}
          {selectedMovieId && <div className="selected-movie-id">Selected Movie ID: {selectedMovieId}</div>}
          <textarea
            className="modal-input"
            placeholder="What about it?"
            value={postText}
            onChange={handlePostTextChange}
          ></textarea>
          {error && <div className="error-message">{error}</div>}
        </div>
        <div className="modal-footer">
          <button className="button cancel-button" onClick={onClose}>Cancel</button>
          {isLoading ? (
            <div className="loading-animation">Loading...</div>
          ) : (
            <button className="button create-button" onClick={handleCreatePost}>Create</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostTab;
