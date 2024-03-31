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
  const [postImage, setPostImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreatePost = async () => {
    if (!postText.trim() || !selectedMovieId) {
      setError('Please provide both a movie and your thoughts.');
      return;
    }
  
    setIsLoading(true);
    setError('');
  
    try {
      const postBody = JSON.stringify({
        content: postText.trim(),
        movie: selectedMovieTitle,
        movieId: selectedMovieId,
      });
  
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: postBody,
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create post');
      }
  
      // Parse response to get postId
      const responseData = await response.json();
      const postId = responseData.post._id;
  
      console.log('Post created successfully');
      console.log('Post ID:', postId);
  
      // Upload the image if available
      if (postImage) {
        const formData = new FormData();
        formData.append('postImage', postImage);
  
        try {
          const imageResponse = await fetch(`/api/posts/uploadPostImage/${postId}`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
          });
  
          if (!imageResponse.ok) {
            throw new Error(`Failed to upload post image. Status: ${imageResponse.status}`);
          }
  
          const imageData = await imageResponse.json();
          console.log('Post Image Uploaded:', imageData);
  
          // If image upload is successful, update the post with the imageUrl
          const updatedPostBody = JSON.stringify({
            imageUrl: imageData.imagePath, // Use the imagePath returned from the server
          });
  
          const updateResponse = await fetch(`/api/posts/${postId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: updatedPostBody,
          });
  
          if (!updateResponse.ok) {
            const data = await updateResponse.json();
            throw new Error(data.message || 'Failed to update post');
          }
  
          console.log('Post updated with image URL');
        } catch (error) {
          console.error('Error uploading post image:', error);
        }
      }
  
      onClose();

      setTimeout(() => {
        window.location.reload();
      }, 10); 
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
          const apiKey = '3c4682174e03411b1f2ea9d887d0b8f3';
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

  const handleImageChange = (event) => {
    setPostImage(event.target.files[0]); // Update the state with the selected image file
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
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
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
