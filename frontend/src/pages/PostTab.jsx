import React, { useState, useEffect } from "react";
import "./PostTab.css";

const PostTab = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  const [files, setFiles] = useState([]);
  const [fileInputLabel, setFileInputLabel] = useState("Upload Image(s)");
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState('');

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    setFiles(selectedFiles);
    const fileNames = Array.from(selectedFiles)
      .map(file => file.name)
      .join(', ');
    setFileInputLabel(fileNames || "Upload Image(s)");
  };

  useEffect(() => {
    if (searchTerm.length > 2) {
      const apiKey = '3c4682174e03411b1f2ea9d887d0b8f3';
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchTerm)}`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          setSuggestions(data.results);
        })
        .catch(error => console.error('Error fetching movie suggestions:', error));
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const selectMovie = (movie) => {
    setSearchTerm(movie.title); // Update the input field with the movie's title
    setSelectedMovieId(movie.id); // Store the selected movie's ID
    setSuggestions([]); // Clear suggestions
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
          <textarea className="modal-input" placeholder="What about it?"></textarea>
          <label htmlFor="file-upload" className="file-upload-label">
            {fileInputLabel}
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            multiple
            style={{ display: 'none' }}
          />
        </div>
        <div className="modal-footer">
          <button className="button cancel-button" onClick={onClose}>Cancel</button>
          <button className="button create-button" onClick={onClose} type="submit">Create</button>
        </div>
      </div>
    </div>
  );
};

export default PostTab;
