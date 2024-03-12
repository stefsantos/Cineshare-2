import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom'
import './Post.css';
import CommentPopup from './CommentPopup';
import SharePopup from './SharePopup';
import { useUser } from '../../src/UserContext';

function Post({ post }) {
    const { activeusername } = useUser();
    const [isHeartActive, setIsHeartActive] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showShare, setShowShare] = useState(false);
    
    // Event handler for clicking the heart icon
    const toggleHeart = () => {
        setIsHeartActive(!isHeartActive);
    };

    // Function to open the comment pop-up
    const openComments = () => {
        setShowComments(true);
    };

    // Function to close the comment pop-up
    const closeComments = () => {
        setShowComments(false);
    }

    const openShare = () => {
        setShowShare(true);
    };

    const closeShare = () => {
        setShowShare(false);
    };

    const handleReloadClick = () => {
        setTimeout(() => {
          window.location.reload();
        }, 10); 
      };
    
    return (
        <div className = "post">
            <h4>
                {post.user === activeusername ? (
                    <Link to={`/myprofile_page`} className="post-username" onClick={handleReloadClick}>
                        {post.user} 
                    </Link>
                ) : (
                    <Link to={`/profile/${post.user}`} className="post-username">
                        {post.user} 
                    </Link>
                )}
                {' watched '}
                <Link to={`/movie/${post.movieId}`} className="post-movie">
                    {post.movie}
                </Link>
            </h4>

            <p>{post.content}</p>
            {post.imageUrl && (
                <img src={post.imageUrl} alt="Post visual" className="post-image" />
            )}
            <div className='postactions'>
                <div className={`heart ${isHeartActive ? 'heart-active' : ''}`} onClick={toggleHeart}></div>
                <div className='comment' onClick={openComments}></div>
                <div className='share' onClick={openShare}></div>
            </div>
            <small>{post.timestamp}</small>
            <CommentPopup isOpen={showComments} onClose={closeComments} post={post} />
            <SharePopup isOpen={showShare} onClose={closeShare} post={post} />
        </div>

        
    );
}

export default Post;