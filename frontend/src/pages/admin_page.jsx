import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Post from './Post';
import './admin_page.css';

function adminPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAllPosts();
    }, []);

    const fetchAllPosts = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/posts/allfeed');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setPosts(data.feedPosts);
        } catch (error) {
            console.error("Error fetching posts:", error);
            setError("Error fetching posts. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page_container">
            <div className="adminpost_container">
                <div className="content-header">
                    Posts
                </div>

                <div className="admin-userposts">           
                    {loading ? (
                        <p>Loading posts...</p>
                    ) : (
                        posts.map((post, index) => (
                            <Post key={index} post={{
                                _id: post._id,
                                user: post.postedBy ? post.postedBy.username : 'deleteduser',
                                movieId: post.movieId,
                                movie: post.movie,
                                content: post.content,
                                imageUrl: post.imageUrl,
                                timestamp: new Date(post.createdAt).toLocaleDateString(),
                                isFlagged: post.isFlagged
                            }} />
                        ))
                    )}     
                </div>
            </div>

            <div className="adminreport_container">
                <div className="report-content-header">
                    Reports
                </div>

                <div className="admin-reports">
                    {loading ? (
                        <p>Loading posts...</p>
                    ) : posts.filter(post => post.isFlagged).length > 0 ? (
                        posts.filter(post => post.isFlagged).map((post, index) => (
                            <Post key={index} post={{
                                _id: post._id,
                                user: post.postedBy ? post.postedBy.username : 'deleteduser',
                                movieId: post.movieId,
                                movie: post.movie,
                                content: post.content,
                                imageUrl: post.imageUrl,
                                timestamp: new Date(post.createdAt).toLocaleDateString(),
                                isFlagged: post.isFlagged
                            }} />
                        ))
                    ) : (
                        <p>No reported posts.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default adminPage;