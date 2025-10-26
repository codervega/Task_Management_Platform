import React, { useState } from "react";

const UpdateFile = ({ fileId, onUpdateSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpdate = async () => {
    if (!file) return alert("Select a file to update");

    const formData = new FormData();
    formData.append("files", file);
    formData.append("taskId", ""); // Not needed if backend replaces by fileId, else pass taskId

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/delete/${fileId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete old file");

      const uploadRes = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(data.error || "Failed to upload new file");

      alert("File updated successfully!");
      onUpdateSuccess();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-section">
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpdate} disabled={loading}>
        {loading ? "Updating..." : "Update File"}
      </button>
    </div>
  );
};

export default UpdateFile;
