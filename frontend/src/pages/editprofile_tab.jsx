import React, { useState } from "react";
import "./editprofile_tab.css";
import { useUser } from '../../src/UserContext';

const EditProfileTab = ({ isVisible, onClose }) => {
  const { updateUser } = useUser();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const handleSaveChanges = async () => {
    try {
      const requestBody = {
        bio: bio,
      };
  
      if (username.trim() !== "") {
        requestBody.username = username;
      }
  
      const response = await fetch(`http://localhost:3000/api/users/update/self}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error("Error updating user bio");
      }
  
      // Update user context with the new username
      if (requestBody.username) {
        updateUser(requestBody.username);
      }
  
      onClose();
    } catch (error) {
      console.error("Error saving changes:", error.message);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-content">
          <input
            className="modal-input"
            type="text"
            placeholder="Change Profile Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Update username state onChange
          />
          <textarea
            className="modal-input"
            placeholder="Change Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)} // Update bio state onChange
          ></textarea>
          {/* <div>
            <h2>Set Favorites</h2>
          </div>
          <div className="grid-3x3">
            <button className="grid-item">+</button>
            <button className="grid-item">+</button>
            <button className="grid-item">+</button>
            <button className="grid-item">+</button>
            <button className="grid-item">+</button>
            <button className="grid-item">+</button>
          </div> */}
        </div>
        <div className="modal-footer">
          <button className="button cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="button create-button" onClick={handleSaveChanges} type="button">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileTab;
