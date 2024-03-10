import React, { useState } from 'react';
import './CommentPopup.css';

const CommentPopup = ({ isOpen, onClose, post }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const handleInputChange = (e) => {
    setNewComment(e.target.value);
  };

  const removeComment = (commentId) => {
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const newCommentObject = {
      id: Date.now(), 
      text: newComment,
    };
    setComments(prevComments => [...prevComments, newCommentObject]);
    setNewComment('');
  };
  

  if (!isOpen) return null;

  return (
    <div className="comment-popup-overlay" onClick={onClose}>
      <div className="comment-popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-popup" onClick={onClose}>×</button>
        <div className="post-content">
          <p>{post.content}</p>
          {post.imageUrl && (
            <img src={post.imageUrl} alt="Post visual" style={{ maxWidth: '100%', marginTop: '10px' }} />
          )}
        </div>
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
              <div key={comment.id} className="comment-item">
                <span className="comment-text">{comment.text}</span>
                <button onClick={() => removeComment(comment.id)} className="delete-comment">&#x1F5D1;</button>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentPopup;
