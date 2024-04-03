import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom'
import './Post.css';
import CommentSection from './CommentSection';
import { useUser } from '../../src/UserContext';
import { FaPencilAlt } from "react-icons/fa";

function Post({ post }) {
    const { activeusername } = useUser();
    const [isHeartActive, setIsHeartActive] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes?.length ?? 0);
    const [editMode, setEditMode] = useState(false);
    const [editedContent, setEditedContent] = useState(post.content);
    const [isDislikeActive, setIsDislikeActive] = useState(false);
    const [dislikeCount, setDislikeCount] = useState(post.dislikes?.length ?? 0);
    
    useEffect(() => {
        setIsHeartActive(post.likes?.includes(activeusername));
        setIsDislikeActive(post.dislikes?.includes(activeusername));
        fetchLikeCount();
        fetchDislikeCount();
    
        const likeStatusInterval = setInterval(fetchLikeStatus, 1000);
    
        const dislikeStatusInterval = setInterval(fetchDislikeStatus, 1000);
    
        return () => {
            clearInterval(likeStatusInterval);
            clearInterval(dislikeStatusInterval);
        };
    }, [post.likes, post.dislikes, activeusername, post._id]);
    

    const fetchLikeStatus = async () => {
        try {
            const response = await fetch(`/api/posts/likes/status/${post._id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch like status');
            }
            const data = await response.json();
            setIsHeartActive(data.isLiked);
        } catch (error) {
            console.error('Error fetching like status:', error);
        }
    };
    
    const fetchDislikeStatus = async () => {
        try {
            const response = await fetch(`/api/posts/dislikes/status/${post._id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch dislike status');
            }
            const data = await response.json();
            setIsDislikeActive(data.isDisliked);
        } catch (error) {
            console.error('Error fetching dislike status:', error);
        }
    };

    const fetchLikeCount = async () => {
        try {
            const response = await fetch(`/api/posts/likes/count/${post._id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setLikeCount(data.likeCount);
            } else {
                throw new Error('Failed to fetch like count');
            }
        } catch (error) {
            console.error('Error fetching like count:', error);
        }
    };

    const fetchDislikeCount = async () => {
        try {
            const response = await fetch(`/api/posts/dislikes/count/${post._id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setDislikeCount(data.dislikeCount);
            } else {
                throw new Error('Failed to fetch dislike count');
            }
        } catch (error) {
            console.error('Error fetching dislike count:', error);
        }
    };

    const toggleDislike = async () => {
        try {
            const res = await fetch("/api/posts/dislike/" + post._id, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await res.json();
            if (data.error) {
                console.error("Error toggling dislike:", data.error);
                return;
            }
            fetchDislikeStatus();
            fetchDislikeCount(); 
        } catch (error) {
            console.error("Error toggling dislike:", error);
        }
    };
    

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
            fetchLikeStatus();
            fetchLikeCount();

        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    // Function to open the comment section
    const toggleCommentsVisibility = () => {
        setShowComments(!showComments);
    };

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

            setTimeout(() => {
                window.location.reload();
            }, 10); 
        } catch (error) {
            console.error(error);
        }
    };

    const handleFlagPost = async (e) => {
        try {
            console.log(post);

            e.preventDefault();
            if(!window.confirm('Are you sure you want to flag this post?')) return;

            const res = await fetch(`api/posts/flag/${post._id}`, {
                method: 'POST',
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

    const toggleEditMode = () => {
        setEditMode(!editMode);

        if (editMode) {
            setEditedContent(post.content);
        }
    };

    const handleEditPost = async (e) => {
        e.preventDefault();
    
        try {
            const res = await fetch(`api/posts/${post._id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`, // If your endpoint requires authentication
                },
                body: JSON.stringify({ content: editedContent }),
            });
    
            if (!res.ok) {
                throw new Error('Failed to edit post');
            }
            const data = await res.json();
    
            console.log('Post edited successfully', data);
            setEditMode(false);
        } catch (error) {
            console.error('Error editing post:', error);
        }
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

            {!editMode ? (
                <p>{post.content}</p>
                ) : (
                <form onSubmit={handleEditPost}>
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                    ></textarea>
                    <button type="submit">Save</button>
                    <button type="button" onClick={toggleEditMode}>Cancel</button>
                </form>
            )}

            {post.imageUrl && (
                <img src={`https://cineshare-51j1.onrender.com/${post.imageUrl}`} alt="Post visual" className="post-image" />
            )}

            <div className='postactions'>
                <div className={`heart ${isHeartActive ? 'heart-active' : ''}`} onClick={toggleHeart}></div>
                <div className={`dislike ${isDislikeActive ? 'dislike-active' : ''}`} onClick={toggleDislike}></div>
                <div className='comment' onClick={toggleCommentsVisibility}></div>
                {post.user === activeusername && (
                    <div className='edit' onClick={toggleEditMode}>
                        <FaPencilAlt />
                    </div>
                )}
                {post.user !== activeusername && (
                    <div className='report' onClick={handleFlagPost}></div>
                )}
                {(post.user === activeusername || activeusername === "admin123") && (
                    <div className='delete' onClick={handleDeletePost}></div>
                )}
            </div>
            <div className='like-counter'>{likeCount} {likeCount == 1 ? 'like' : 'likes'}</div>
            <div className='dislike-counter'>{dislikeCount} {dislikeCount == 1 ? 'dislike' : 'dislikes'}</div>
            <small>{post.timestamp}</small>
            {showComments && <CommentSection post={post} />}
        </div>
    );
}

export default Post;