import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FollowerFollowing(props) {
    const navigate = useNavigate();

  // State to track if the user is following the creator
  const [isFollowing, setIsFollowing] = useState(false);
  
  const handleView = () => {
    navigate('/creatorprofile', { state: { email: props.profile.email } });
  };

  const loadData = async () => {
    const profileResponse = await fetch(`${process.env.BACKEND_URL}/api/myprofiledata`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: props.profile.email }),
    });

    let profileRes = await profileResponse.json();

    const currentUserEmail = localStorage.getItem("userEmail");
    if (profileRes[0]) {
      const followers = Array.isArray(profileRes[0].follower) ? profileRes[0].follower : [profileRes[0].follower];
      const isUserFollowing = followers.includes(currentUserEmail);
      setIsFollowing(isUserFollowing);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFollowClick = async (e) => {
    e.stopPropagation();
    try {
      const currentUserEmail = localStorage.getItem("userEmail");
      if (!currentUserEmail) {
        console.log("User not logged in. Please log in to follow.");
        return;
      }
      setIsFollowing(!isFollowing);

      const response = await fetch(`${process.env.BACKEND_URL}/api/followfollowing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentUserEmail,
          profileUserEmail: props.profile.email,
          isFollowing: isFollowing
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        console.error(result.error);
        setIsFollowing(response.isFollowing);
      }
    } catch (error) {
      console.error('Error following user:', error);
      setIsFollowing(!isFollowing);
    }
    loadData();
  };
    return (
        <div className="card mt-3 shadow" style={{ width: "100%", cursor: "pointer", borderRadius: '15px', overflow: 'hidden' }} onClick={handleView}>
          <div className="d-flex align-items-center p-3">
            {/* Profile Image */}
            <img 
              src={props.profile.profilePic} 
              alt="Profile" 
              style={{ 
                width: "60px", 
                height: "60px", 
                objectFit: "cover", 
                borderRadius: "50%", 
                border: '2px solid #007bff' 
              }} 
            />
    
            {/* Username and Follow/Following button side by side */}
            <div className="ms-3 w-100 d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1" style={{ fontWeight: 'bold', color: '#FFF' }}>{props.profile.username}</h5>
              </div>
    
              {/* Follow/Following Button */}
              <button 
                className={`btn btn-sm ${isFollowing ? 'btn-success' : 'btn-primary'}`} 
                onClick={handleFollowClick}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>
        </div>
      );
    }
    



  

  