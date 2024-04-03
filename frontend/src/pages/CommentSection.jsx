import React, { useState, useEffect } from 'react';
import './CommentSection.css';


const CommentSection = ({ post }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setNewComment(e.target.value);
  };

  const removeComment = (commentId) => {
    setComments(comments.filter(comment => comment.id !== commentId));
  };



  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
  
    try {
      const response = await fetch(`/api/posts/reply/${post._id}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: newComment }),
      });
  
      if (!response.ok) {
          
          const errorData = await response.json(); 
          throw new Error(errorData.message || "An error occurred while submitting the comment.");
      }
  
      const data = await response.json(); 
      setComments(prevComments => [...prevComments, data]); 
      setNewComment(''); // Reset the input field
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };
  
  // In CommentSection component
  useEffect(() => {
    const fetchComments = async () => {
      try {
        console.log(`Fetching comments for post ID: ${post._id}`);
        const response = await fetch(`/api/posts/${post._id}/comments`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem('token')}`, 
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setComments(data.comments); 
      } catch (error) {
        console.error('Error fetching comments:', error);
        setError(error.message);
      }
    };

    fetchComments();
  }, [post._id]); 



  return (
    <div className="comments-section">
      <form className="submit-comment" onSubmit={handleCommentSubmit}>
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={handleInputChange}
        />
        <button type="submit">Submit</button>
      </form>
      <div className="comments-list">
      {comments.length > 0 ? (
        comments.map((comment) => (
          comment && comment.text ? (
            <div key={comment._id} className="comment-item">
              <span className="comment-text">{comment.text}</span>
              <button onClick={() => removeComment(comment._id)} className="delete-comment">&#x1F5D1;</button>
            </div>
          ) : null
        ))
      ) : (
        <p>No comments yet.</p>
      )}
      </div>
    </div>
  );
};

export default CommentSection;
