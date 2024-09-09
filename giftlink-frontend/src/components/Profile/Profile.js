import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import './Profile.css';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';

const Profile = () => {
  const [userDetails, setUserDetails] = useState({ name: '', email: '' });
  const [updatedDetails, setUpdatedDetails] = useState({ name: '', email: '' });
  const [changed, setChanged] = useState("");
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const { authToken, handleLogin, checkAuth } = useAppContext();

  const fetchUserProfile = useCallback(async () => {
    const url = `${urlConfig.backendUrl}/api/auth/profile`;
    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    };
    
    try {
        const response = await fetch(url, options);
  
      if (response.ok) {
        const data = await response.json();
        
        setUserDetails({ name: data.name, email: data.email });
        setUpdatedDetails({ name: data.name, email: data.email });
      } else {
        throw new Error("Failed to fetch profile");
      }
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
    checkAuth();
    fetchUserProfile();
  }, [navigate, checkAuth, fetchUserProfile]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    setUpdatedDetails({
      ...updatedDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${urlConfig.backendUrl}/api/auth/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(updatedDetails)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('data: ' + data);
        handleLogin(updatedDetails.name, updatedDetails.email, data.authtoken);
        setUserDetails(updatedDetails);
        setEditMode(false);
        setChanged("Profile updated successfully!");
        setTimeout(() => {
          setChanged("");
          navigate("/");
        }, 1000);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      setChanged("Error updating profile. Please try again.");
    }
  };

  return (
    <div className="profile-container">
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={userDetails.email}
              disabled // Disable the email field
            />
          </label>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={updatedDetails.name}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit">Save</button>
        </form>
      ) : (
        <div className="profile-details">
          <h1>Hi, {userDetails.name}</h1>
          <p><b>Email:</b> {userDetails.email}</p>
          <button onClick={handleEdit}>Edit</button>
          <span style={{color:'green', height:'.5cm', display:'block', fontStyle:'italic', fontSize:'12px'}}>{changed}</span>
        </div>
      )}
    </div>
  );
};

export default Profile;
