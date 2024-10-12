import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CreatorCard from '../components/CreatorCard';
import { useMediaQuery } from 'react-responsive';

export default function Creators() {
    const [profiles, setProfiles] = useState([]); // State to store profiles
    const isDesktop = useMediaQuery({ query: '(min-width: 768px)' });
    useEffect(() => {
        // Fetch all profiles when the component mounts
        const fetchProfiles = async () => {
          const email = localStorage.getItem("userEmail")
            try {
              const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/usersprofile`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email }),
              });
                const data = await response.json();
                setProfiles(data); // Store profiles in state
            } catch (error) {
                console.error('Error fetching profiles:', error);
            }
        };

        fetchProfiles(); // Call the fetch function
    }, []); // Empty dependency array means this runs once on mount

    return (
        <div>
            <Navbar />
            <div className="container">
                <div className="row g-3">
                    {profiles.map((profile) => (
                        <div className="col-lg-3 col-sm-6 col-12" key={profile._id}>
                            <CreatorCard profile={profile} /> {/* Pass each profile as props */}
                        </div>
                    ))}
                </div>
            </div>
            {isDesktop && (
            <Footer />
            )}
        </div>
    );
}
