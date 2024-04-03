import React, { useState, useEffect } from 'react';
import './CommentSection.css';
import { useUser } from '../../src/UserContext';

const CommentSection = ({ post }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const { activeusername } = useUser();

  const handleInputChange = (e) => {
    setNewComment(e.target.value);
  };

const removeComment = async (commentId) => {
  try {
      console.log(commentId);
      if(!window.confirm('Are you sure you want to delete this comment?')) return;
      const response = await fetch(`/api/posts/comments/delete/${commentId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
          const errorData = await response.json(); 
          throw new Error(errorData.message || "An error occurred while deleting the comment.");
      }

      setComments(currentComments => currentComments.filter(comment => comment._id !== commentId));
  } catch (error) {
      console.error('Error deleting comment:', error);
  }
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
      setNewComment(''); 
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };
  
  useEffect(() => {
    const fetchComments = async () => {
      try {
        console.log(`Fetching comments for post ID: ${post._id}`);
        const response = await fetch(`/api/posts/comments/${post._id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        console.log(response);
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
              <span className="comment-text"><span className="comment-username">{comment.username}</span>: {comment.text}</span>
              {(comment.username === activeusername || activeusername === "admin123") && (
                <button onClick={() => removeComment(comment._id)} className="delete-comment">&#x1F5D1;</button>
              )}
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
