import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Card(props) {
  const navigate = useNavigate();

  const handleView = () => {
    navigate('/viewblog', { state: { blogData: props.blogData } });
  };

  return (
    <div>
      <div
        className="card mt-3 mb-5 shadow"
        style={{ width: "18rem", maxHeight: "480px", position: 'relative', cursor: "pointer" }}
        onClick={handleView}
      >
        <img
          src={props.blogData.img}
          className="card-img-top"
          alt={props.blogData.title} // Use title for accessibility
          style={{ width: "100%", height: "170px", objectFit: "cover" }}
        />
        <div className="card-body" > {/* Increased padding */}
          <h5 className="card-title text-truncate" style={{ height: '1.5em' }}>
          Title: {props.blogData.title} {/* Removed "Title:" for cleaner look */}
          </h5>
          <div className="container w-100" style={{ height: '5em', overflow: 'hidden' }}>
            <p className="card-text" style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3, overflow: 'hidden' }}>
              {props.blogData.desc} {/* Removed "Description:" for cleaner look */}
            </p>
          </div>
          <div style={{ color: '#f5f5f7', fontWeight: '300' }}>
            Category: {props.blogData.categoryName}
          </div>
        </div>
      </div>
    </div>
  );
}
