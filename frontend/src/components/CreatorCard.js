import React, { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreatorCard(props) {
  const navigate = useNavigate();

  // State to track if the user is following the creator
  const [isFollowing, setIsFollowing] = useState(false);
  const handleView = () => {
    navigate('/creatorprofile', { state: { email: props.profile.email } });
  };

  const loadData = async () => {
    // Fetch profile data
    const profileResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/myprofiledata`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: props.profile.email }),
    });
  
    let profileRes = await profileResponse.json();
  
    const currentUserEmail = localStorage.getItem("userEmail");
  
    // After profileData is set, calculate followers
    if (profileRes[0]) {
      const followers = Array.isArray(profileRes[0].follower) ? profileRes[0].follower : [profileRes[0].follower];
      const isUserFollowing = followers.includes(currentUserEmail);
      setIsFollowing(isUserFollowing); // Set the follow state
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);

  const handleFollowClick = async (e) => {
    e.stopPropagation();
    try {
        const currentUserEmail = localStorage.getItem("userEmail");
        if(!currentUserEmail){
            navigate('/Login',{ state: { message :"Please log in to follow."} })
            return; 
          }
        // Optimistic UI update
        setIsFollowing(!isFollowing);

        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/followfollowing`, {
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
            // Revert the state in case of failure
            setIsFollowing(response.isFollowing);
        }
    } catch (error) {
        console.error('Error following user:', error);
        // Revert the state in case of error
        setIsFollowing(!isFollowing);
    }
    loadData()
};
  return (
    <div>
      <div 
        className="card mt-3 shadow" 
        style={{ 
          width: "18rem", 
          height: "340px",  // Adjusted height to accommodate buttons
          cursor: "pointer", 
          borderRadius: '15px', 
          overflow: 'hidden', 
          transition: 'transform 0.2s', 
        }} 
        onClick={handleView}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <img 
          src={props.profile.profilePic} 
          className="card-img-top" 
          alt="Profile" 
          style={{ 
            width: "150px", 
            height: "150px", 
            objectFit: "cover", 
            borderRadius: "50%", 
            margin: "10px auto", 
            border: '3px solid #007bff' 
          }} 
        />
        <div className="card-body text-center">
          <h5 className="card-title" style={{ fontWeight: 'bold', color: '#FFFF' }}>{props.profile.username}</h5>
          <div className="container w-100">
          <div 
            className="d-inline h-100 fs-6 text-muted" 
            style={{ 
              minHeight: '3em', // Minimum height to ensure space is reserved even if no text
              maxHeight: '3em', // Maximum height for the bio section
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap',
              display: 'flex', // Ensures the text stays aligned vertically
              alignItems: 'center' // Vertically centers the text if present
            }}
          >
            {props.profile.bio ? props.profile.bio : '       '} {/* Keeps space even if bio is empty */}
          </div>
        </div>
          
          {/* Follow/Following Button */}
          <button 
            className={`btn btn-sm ${isFollowing ? 'btn-success' : 'btn-primary'} mt-2 w-100`} 
            onClick={handleFollowClick}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>
      </div>
    </div>
  );
}
