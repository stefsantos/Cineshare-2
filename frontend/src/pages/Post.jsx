import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom'
import './Post.css';
import CommentPopup from './CommentPopup';
import { useUser } from '../../src/UserContext';

function Post({ post }) {
    const { activeusername } = useUser();
    const [isHeartActive, setIsHeartActive] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes?.length ?? 0);
    
    // Event handler for clicking the heart icon
    const toggleHeart = async () => {

        try {
            
            const res = await fetch("/api/posts/like/" + post._id, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            if (data.error) {
                console.error("Error toggling like:", data.error);
                return;
            }
            console.log(data);
            
            setIsHeartActive(data.message === "post liked");
            setLikeCount(prevCount => data.message === "post liked" ? prevCount + 1 : prevCount - 1);

        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    // Function to open the comment pop-up
    const openComments = () => {
        setShowComments(true);
    };

    // Function to close the comment pop-up
    const closeComments = () => {
        setShowComments(false);
    }

    const handleDeletePost = async (e) => {
        try {
            console.log(post);

            e.preventDefault();
            if(!window.confirm('Are you sure you want to delete this post?')) return;

            const res = await fetch(`api/posts/${post._id}`, {
                method: 'DELETE',
            });

            const data = await res.json();
            
            if (data.error) {
                console.log(data.error);
                return;
            }
            console.log(data.message);
        } catch (error) {
            console.error(error);
        }
    }

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
                {post.user === activeusername && (
                    <div className='delete' onClick={handleDeletePost}></div>
                )}
            </div>
            <div className='like-counter'>{likeCount} {likeCount == 1 ? 'like' : 'likes'}</div>
            <small>{post.timestamp}</small>
            <CommentPopup isOpen={showComments} onClose={closeComments} post={post} />
        </div>

        
    );
}

export default Post;