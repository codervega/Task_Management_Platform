import React, { useState } from "react";

const UploadFile = ({ taskId, onUploadSuccess }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!files.length) return alert("Select files to upload");

    const formData = new FormData();
    for (let file of files) {
      formData.append("files", file);
    }
    formData.append("taskId", taskId);

    try {
      setLoading(true);
      setError("");
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      alert("Files uploaded successfully!");
      setFiles([]);
      onUploadSuccess();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-section">
      <h3>Upload Files</h3>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default UploadFile;
