import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ConfirmationModal from '../components/ConfirmationModal';

export default function Signup() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ name: "", username: "", email: "", password: "" });
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [errorMessage, setErrorMessage] = useState(""); // State to hold the error message
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    const response = await fetch("http://localhost:4000/api/createuser", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: credentials.name,
        username: credentials.username,
        email: credentials.email,
        password: credentials.password
      })
    });
    const json = await response.json();
    if (!json.success) {
      setErrorMessage(json.error); // Set the error message
      setShowModal(true); // Show the modal
    }
    if (json.success) {
      navigate('/Login');
    }
  };
  const handleClose = () => {
    setShowModal(false); // Close the modal
  };
  const onchange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  return (
    <>
    <Navbar/>
    <div
      className="container-fluid d-flex justify-content-center align-items-center vh-100" style={{ marginTop: '-50px' }}>
      <form
        className="w-100"
        style={{
          maxWidth: "400px",
          border: '2px solid #007bff', // Border color
          borderRadius: '10px',
          padding: '20px',
          backgroundColor: 'rgb(53, 57, 53)', // Matching background color
        }}
        onSubmit={handleSubmit}
      >
        <h2 className="text-center text-light mb-4">Signup</h2> {/* Added Title */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label text-light">Name</label>
          <input type="text" className="form-control" name='name' value={credentials.name} required onChange={onchange} />
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="form-label text-light">Username</label>
          <input type="text" className="form-control" name='username' value={credentials.username} required onChange={onchange} />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label text-light">Email address</label>
          <input type="email" className="form-control" name='email' value={credentials.email} onChange={onchange} id="exampleInputEmail1" aria-describedby="emailHelp" required />
          <div id="emailHelp" className="form-text text-light">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label text-light">Password</label>
          <input type="password" className="form-control" name='password' value={credentials.password} onChange={onchange} id="exampleInputPassword1" required />
        </div>
        <button type="submit" className="m-3 btn btn-success">Signup</button>
        <Link to="/Login" className='m-3 btn btn-danger'>Already a user</Link>
      </form>
    </div>
    {/* Confirmation Modal for error messages */}
      <ConfirmationModal 
        show={showModal} 
        handleClose={handleClose} 
        handleConfirm={handleClose} // Use handleClose for dismissing modal
        message={errorMessage} 
        showConfirmButton={false} // Show only the cancel button
      />
    </>
  );
}
