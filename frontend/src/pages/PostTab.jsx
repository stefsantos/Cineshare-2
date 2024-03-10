import React, { useState } from "react";
import "./PostTab.css";

const PostTab = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  const [files, setFiles] = useState([]);
  const [fileInputLabel, setFileInputLabel] = useState("Upload Image(s)");

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    setFiles(selectedFiles);
    const fileNames = Array.from(selectedFiles)
      .map(file => file.name)
      .join(', ');
    setFileInputLabel(fileNames || "Upload Image(s)");
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>Create a New Post</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-content">
          <input className="modal-input" type="text" placeholder="Movie Watched" />
          <textarea className="modal-input" placeholder="What about it?"></textarea>
          <label htmlFor="file-upload" className="file-upload-label">
            {fileInputLabel}
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            multiple
            style={{ display: 'none' }}
          />
        </div>
        <div className="modal-footer">
          <button className="button cancel-button" onClick={onClose}>Cancel</button>
          <button className="button create-button" onClick={onClose} type="submit">Create</button>
        </div>
      </div>
    </div>
  );
};

export default PostTab;
