import React, { useState } from 'react';
import './editprofile_tab.css';
import { useUser } from '../../src/UserContext';

const EditProfileTab = ({ isVisible, onClose }) => {
  const { updateUser, activeusername } = useUser(); // Fetch activeusername from UserContext
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicFile, setProfilePicFile] = useState(null); // Change state name to profilePicFile
  const [bannerFile, setBannerFile] = useState(null); // Change state name to bannerFile
  const [profilepic, setProfilePic] = useState(null); // Change state name to profilePicFile
  const [banner, setBanner] = useState(null); // Change state name to bannerFile
  const [userid, setUserid] = useState([]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/users/profile/${activeusername}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUserid(data._id);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  fetchUserProfile();

  const handleSaveChanges = async () => {
    try {
      const requestBody = {
        bio,
        username,
        profilepic,
        banner,
      };

      if (profilePicFile) { // Change variable name to profilePicFile
        const profilePicData = new FormData();
        profilePicData.append('profilePic', profilePicFile);
        const profilePicResponse = await fetch(`http://localhost:3000/api/users/uploadProfilePic/${userid}`, { // Include activeusername in the URL
          method: 'POST',
          body: profilePicData,
          credentials: 'include',
        });
        const profilePicResult = await profilePicResponse.json();
        console.log('Profile Pic Uploaded:', profilePicResult);
        requestBody.profilepic = profilePicResult.profilePic;
      }

      if (bannerFile) { // Change variable name to bannerFile
        const bannerData = new FormData();
        bannerData.append('banner', bannerFile);
        const bannerResponse = await fetch(`http://localhost:3000/api/users/uploadBanner/${userid}`, { // Include activeusername in the URL
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

      setTimeout(() => {
        window.location.reload();
      }, 10); 
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
          <div classname="pic-upload">
            <div className="pfp-upload">
              <label htmlFor="profilePicUpload">Upload Profile Picture</label>
              <input
                id="profilePicUpload"
                className="file-input"
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePicFile(e.target.files[0])} // Update profile picture state onChange
              />
              <button className="upload-button" onClick={() => document.getElementById('profilePicUpload').click()}>Choose File</button>
            </div>
            <div className="banner-upload">
              <label htmlFor="bannerUpload">Upload Banner</label>
              <input
                id="bannerUpload"
                className="file-input"
                type="file"
                accept="image/*"
                onChange={(e) => setBannerFile(e.target.files[0])} // Update banner state onChange
              />
              <button className="upload-button" onClick={() => document.getElementById('bannerUpload').click()}>Choose File</button>
            </div>
          </div>
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
