import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

export default function CreatorProfile() {
    const location = useLocation();
    const navigate = useNavigate();
    const profileUserEmail = location.state?.email;
    const [blogCat, setBlogCat] = useState([]);
    const [blogData, setBlogData] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false); // State for following status
    const [profileData,setProfileData]=useState('')
    const isDesktop = useMediaQuery({ query: '(min-width: 768px)' });
    const loadData = async () => {
        // Fetch blog data
        let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/myblogs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: profileUserEmail }),
        });
      
        let res = await response.json();
        setBlogData(res[0]);
        setBlogCat(res[1]);
      
        // Fetch profile data
        const profileResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/myprofiledata`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: profileUserEmail }),
        });
      
        let profileRes = await profileResponse.json();
        setProfileData(profileRes[0]);
      
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
      

  const handleFollowClick = async () => {
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
                profileUserEmail: profileData.email, 
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
    loadData();
};

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="container mt-4 flex-grow-1 border border-dark rounded p-3">
                <div className="row justify-content-center text-center">
                    <div className="col-12 col-md-8 col-lg-6">
                        {/* Username and Edit Profile Button */}
                        <div className="text-md-start text-center mb-3">
                            <h5 className="mb-1 d-flex justify-content-between align-items-center">
                                {profileData.username || "username"}
                            </h5>
                        </div>

                        {/* Profile Information and Blogs */}
                        <div className="d-flex align-items-center justify-content-center flex-column flex-md-row">
                            <img
                                src={profileData.profilePic}
                                alt="Profileimage"
                                className="rounded-circle me-4"
                                style={{ width: '160px', height: '160px', objectFit: 'cover' }}
                            />
                            <div className="text-md-start text-center">
                                <div className="mt-3 d-flex justify-content-around w-100">
                                    <div style={{ margin: '0 5px', fontSize: '0.85rem' }}>
                                        <strong>{profileData.blogs && profileData.blogs.length > 0 ? profileData.blogs.length : 0}</strong>
                                        <span style={{ marginLeft: '1px' }}>Blog</span>
                                    </div>
                                    <div style={{ margin: '0 5px', fontSize: '0.85rem' }}>
                                        <strong>{profileData.follower && profileData.follower.length > 0 ? profileData.follower.length : 0}</strong>
                                        <span style={{ marginLeft: '1px' }}>Followers</span>
                                    </div>
                                    <div style={{ margin: '0 5px', fontSize: '0.85rem' }}>
                                        <strong>{profileData.following && profileData.following.length > 0 ? profileData.following.length : 0}</strong>
                                        <span style={{ marginLeft: '1px' }}>Following</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="mb-0 mt-3">{profileData.bio}</p>

                        {/* Follow/Unfollow Button */}
                        <button
                            className={`btn btn-sm ${isFollowing ? 'btn-success' : 'btn-primary'} mt-2 w-100`}
                            onClick={handleFollowClick}
                        >
                            {isFollowing ? 'Following' : 'Follow'}
                        </button>
                    </div>
                </div>
                <hr />
                <div className="row mt-4">
                    <h5 className="text-center w-100">Blogs</h5>
                    <hr />
                    <div className="container">
                        {blogCat && blogCat.length > 0 && blogData && blogData.length > 0 ? (
                            blogCat.map((data) => {
                                // Filter blogs by category
                                const filteredBlogs = blogData.filter(blog =>
                                    blog.categoryName === data.categoryName
                                );

                                // Check if there are filtered blogs
                                if (filteredBlogs && filteredBlogs.length > 0) {
                                    return (
                                        <div className="row mb-3" key={data._id}>
                                            <div className="fs-3 mb-3 mt-3">{data.categoryName}</div>
                                            <hr />
                                            {filteredBlogs.map((filterblogs) => (
                                                <div key={filterblogs._id} className="col-12 col-md-6 col-lg-3">
                                                    <Card blogData={filterblogs} />
                                                </div>
                                            ))}
                                        </div>
                                    );
                                }
                                return null; // Do not render category if no blogs match
                            })
                        ) : (
                            <p className="text-center fw-bold">No blogs available</p> // Show this message if no blogs are found
                        )}
                    </div>

                </div>
            </div>
            {isDesktop && (
      <Footer />
      )}
        </div>
    );
}
