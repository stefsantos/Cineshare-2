import React, { useState } from 'react';
import './editprofile_tab.css';
import { useUser } from '../../src/UserContext';

const EditProfileTab = ({ isVisible, onClose }) => {
  const { updateUser } = useUser();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [banner, setBanner] = useState(null);

  const handleSaveChanges = async () => {
    try {
      const requestBody = {
        bio,
        username,
      };

      if (profilePic) {
        const profilePicData = new FormData();
        profilePicData.append('profilePic', profilePic);
        const profilePicResponse = await fetch('http://localhost:3000/api/users/uploadProfilePic', {
          method: 'POST',
          body: profilePicData,
          credentials: 'include',
        });
        const profilePicResult = await profilePicResponse.json();
        console.log('Profile Pic Uploaded:', profilePicResult);
        requestBody.profilePic = profilePicResult.profilePic;
      }

      if (banner) {
        const bannerData = new FormData();
        bannerData.append('banner', banner);
        const bannerResponse = await fetch('http://localhost:3000/api/users/uploadBanner', {
          method: 'POST',
          body: bannerData,
          credentials: 'include',
        });
        const bannerResult = await bannerResponse.json();
        console.log('Banner Uploaded:', bannerResult);
        requestBody.banner = bannerResult.banner;
      }

      const response = await fetch(`http://localhost:3000/api/users/update/self`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Error updating user profile');
      }

      // Update user context with the new username
      if (username.trim() !== '') {
        updateUser(username);
      }

      onClose();
    } catch (error) {
      console.error('Error saving changes:', error.message);
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
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePic(e.target.files[0])} // Update profile picture state onChange
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setBanner(e.target.files[0])} // Update banner state onChange
          />
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
