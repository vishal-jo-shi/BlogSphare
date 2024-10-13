import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CreatorCard from '../components/CreatorCard';
import { useMediaQuery } from 'react-responsive';

export default function Creators() {
    const [profiles, setProfiles] = useState([]); // State to store profiles
    const [search, setSearch] = useState(""); // State for the search query
    const isDesktop = useMediaQuery({ query: '(min-width: 768px)' });

    useEffect(() => {
        const fetchProfiles = async () => {
            const email = localStorage.getItem("userEmail");
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
            <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)} // Update search state
            />
            <div className="container">
                <div className="row g-3">
                    { Array.isArray(profiles) && profiles.length > 0 ? (
                    profiles.map((profile) => {
                        // Directly filter here
                        if (profile.username.toLowerCase().includes(search.toLowerCase())) {
                            return (
                                <div className="col-lg-3 col-sm-6 col-12" key={profile._id}>
                                    <CreatorCard profile={profile} /> {/* Pass each profile as props */}
                                </div>
                            );
                        }
                        return null; // Return null if the profile does not match the search
                    })
                ) : (
                    <p>No user available</p>
                  )}
                </div>
            </div>
            {isDesktop && (
                <Footer />
            )}
        </div>
    );
}
