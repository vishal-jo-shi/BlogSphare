import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Comment({ username, userEmail,content, timestamp, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content); // State to hold edited comment content
  const currentUserEmailEmail = localStorage.getItem("userEmail");

  const handleEdit = () => {
    onEdit(editedContent); // Call the onEdit function passed as prop
    setIsEditing(false); // Close the editing state
  };

  // Check if the current user is the owner of the comment
  const isCommentOwner = currentUserEmailEmail === userEmail;
  const navigate= useNavigate();
  const handleClick=()=>{
    if(isCommentOwner){
      navigate('/myprofile')
    }else{
      navigate('/creatorprofile',{ state: { email: userEmail} })
    }
  }
  return (
    <div className="card my-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="card-title btn" onClick={handleClick}>{"@"+username}</h6>
          {isCommentOwner && ( // Only show edit and delete if the user is the owner of the comment
            <div>
              <button className="btn btn-primary btn-sm me-2" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
              <button className="btn btn-danger btn-sm" onClick={onDelete}>
                Delete
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)} // Update state with new content
              className="form-control"
              rows="3"
            />
            <button className="btn btn-success btn-sm mt-2" onClick={handleEdit}>
              Save
            </button>
          </div>
        ) : (
          <p className="card-text">{content}</p>
        )}

        <small className="text-muted">{new Date(timestamp).toLocaleString()}</small>
      </div>
    </div>
  );
}
