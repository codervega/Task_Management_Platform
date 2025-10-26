import React from "react";

const FileList = ({ files, onDelete }) => {

  const handleDownload = (fileId) => {
    window.open(`http://localhost:5000/api/download/${fileId}`, "_blank");
  };

  return (
    <div className="file-list">
      <h3>Files</h3>
      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <ul>
          {files.map((file) => (
            <li key={file._id} className="file-item">
              <span>{file.filename} (Uploaded by: {file.user.username || file.user.email})</span>
              <button onClick={() => handleDownload(file._id, file.filename)}>Download</button>
              <button onClick={() => onDelete(file._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileList;
