import React from 'react';
import './SharePopup.css';

const SharePopup = ({ isOpen, onClose, post }) => {
  const handleShare = () => {
    navigator.clipboard.writeText(post.link)
      .then(() => alert('Post link copied to clipboard!'))
      .catch(err => console.error('Failed to copy link: ', err));
  };

  if (!isOpen) return null;

  return (
    <div className="share-popup-overlay" onClick={onClose}>
      <div className="share-popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-popup" onClick={onClose}>×</button>
        <div className="post-content">
          <p>{post.content}</p>
          {post.imageUrl && (
            <img src={post.imageUrl} alt="Post visual" style={{ maxWidth: '100%', marginTop: '10px' }} />
          )}
        </div>
        <button className="share-button" onClick={handleShare}>Copy Link</button>
      </div>
    </div>
  );
};

export default SharePopup;
