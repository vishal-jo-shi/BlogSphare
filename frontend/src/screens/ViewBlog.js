import React, { useState, useEffect } from 'react';
import Comment from '../components/Comment';
import { useLocation ,useNavigate} from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useMediaQuery } from 'react-responsive';

export default function ViewBlog() {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [username, setUsername] = useState('');
    const navigate= useNavigate();
    const location = useLocation();
    const blog = location.state?.blogData;
    const isDesktop = useMediaQuery({ query: '(min-width: 768px)' });
    
    const [authorName, setAuthorName] = useState('');
    // Fetch existing comments when the component mounts
    useEffect(() => {
        const fetchComments = async () => {
            if (!blog) return; // Ensure blog exists
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/commentdata`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: blog._id }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const formattedComments = data.map(comment => ({
                        _id: comment._id,
                        username: comment.username,
                        email: comment.email,
                        content: comment.content,
                        timestamp: comment.createdAt,
                    }));
                    setComments(formattedComments);
                } else {
                    console.error("Error fetching comments:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };
        fetchUsername(blog.email);
        fetchComments();
    }, [blog]);

    const fetchUsername = async (email) => {
        if (!blog || !email) return;  // Ensure blog and email are valid
                const isAuthor = email===blog.email
            console.log()
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/username`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),  // Use the email parameter
            });
    
            if (response.ok) {
                const data = await response.json();
                if(isAuthor){
                    setAuthorName(data.username);
                }else{
                    setUsername(data.username);
                }
                
            } else {
                console.error("Error fetching username:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching username:", error);
        }
    };
    
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const currentUserEmail = localStorage.getItem("userEmail");
        if(!currentUserEmail){
            navigate('/Login',{ state: { message :"Please log in to comment."} })
            return; 
          }
        fetchUsername(localStorage.getItem("userEmail"));
        if (newComment.trim() === '') return;
        const newCommentData = {
            blogId: blog._id,
            content: newComment,
            email: localStorage.getItem('userEmail') || 'Guest',
            username: username,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/addcomment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCommentData),
            });
            if (response.ok) {
                const data = await response.json();
                const formattedComment = {
                    _id: data._id,
                    username: data.username,
                    email: data.email,
                    content: data.content,
                    timestamp: data.createdAt,
                };
                setComments((prevComments) => [...prevComments, formattedComment]);
                setNewComment('');
            } else {
                console.error("Error fetching comments:", response.statusText);
            }
        } catch (error) {
            console.error("Error saving comment:", error);
        }
    };

    

    const handleDeleteComment = async (index) => {
        const commentToDelete = comments[index];
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/deletecomment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: commentToDelete._id }),
            });

            if (response.ok) {
                setComments((prevComments) => prevComments.filter((_, i) => i !== index));
            } else {
                console.error("Error deleting comment:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const handleEditComment = async (index, newContent) => {
        const currentComment = comments[index];
        const updatedCommentData = {
            blogId: blog._id,
            content: newContent,
            email: currentComment.email,
            username: currentComment.username,
            createdAt: currentComment.timestamp,
            updatedAt: new Date(),
        };
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/updatecomment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: currentComment._id,
                    data: updatedCommentData
                }),
            });

            if (response.ok) {
                const savedComment = await response.json();
                const formattedComment = {
                    _id: savedComment._id,
                    username: savedComment.username,
                    email: savedComment.email,
                    content: savedComment.content,
                    timestamp: savedComment.updatedAt,
                };
                setComments((prevComments) =>
                    prevComments.map((comment, idx) => idx === index ? formattedComment : comment)
                );
            } else {
                console.error('Error updating comment:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };
    const currentUserEmailEmail = localStorage.getItem("userEmail");
    const isBlogOwner = currentUserEmailEmail === blog.email;
    
    const handleClick=()=>{
        if(isBlogOwner){
        navigate('/myprofile')
        }else{
        navigate('/creatorprofile',{ state: { email: blog.email} })
        }
    }

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <div className="border p-4 rounded shadow-sm">
                    {/* Blog Title and Author */}
                    <h1 className="text-center">{blog.title || "Blog Title"}</h1>

                    {/* Blog Content */}
                    {blog.contents ? (
                        blog.contents.map((section, index) => (
                            <div key={index} className="my-4 ">
                                {section.img && (
                                    <img
                                        src={section.img}
                                        alt={`section-${index}`}
                                        style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
                                    />
                                )}
                                <p className="ms-3 mt-4">{section.paragraph}</p>
                            </div>
                        ))
                    ) : (
                        <p>No content available for this blog.</p>
                    )}
                    <div className="publisher-info d-flex justify-content-end align-items-center my-2 text-muted">
                    <span className="publisher-name fw-bold me-3 btn" onClick={handleClick}>
                       Published By: @{authorName || "Unknown Author"} |
                    </span>
                    <span className="publish-date">
                        Published Date: {new Date(blog.createdAt).toLocaleDateString() || "Unknown Date"}
                    </span>
                </div>


                    {/* Comments Section */}
                    <hr />
                    <h3>Comments</h3>
                    {comments && comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <Comment
                                key={index}
                                username={comment.username}
                                userEmail={comment.email}
                                content={comment.content}
                                timestamp={comment.timestamp}
                                onDelete={() => handleDeleteComment(index)}
                                onEdit={(newContent) => handleEditComment(index, newContent)}
                            />
                        ))
                    ) : (
                        <p>No comments yet. Be the first to comment!</p>
                    )}

                    {/* Add Comment Form */}
                    <div className="mt-4">
                        <h4>Add a Comment</h4>
                        <form onSubmit={handleCommentSubmit}>
                            <div className="mb-3">
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add your comment..."
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">Post</button>
                        </form>
                    </div>
                </div>
            </div>
            {isDesktop && (
            <Footer />
            )}
      
        </>
    );
}
