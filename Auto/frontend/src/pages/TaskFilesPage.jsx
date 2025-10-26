import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UploadFile from "../Components/UploadFile.jsx";
import FileList from "../components/FileList.jsx";

const TaskFilesPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/task-files/${taskId}`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch files");
      setFiles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm("Delete this file?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/delete/${fileId}`, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete file");
      fetchFiles();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [taskId]);

  return (
    <div className="container">
      <button onClick={() => navigate(-1)}>⬅ Back to Tasks</button>
      <h2>Manage Task Files</h2>
      <UploadFile taskId={taskId} onUploadSuccess={fetchFiles} />
      {loading ? <p>Loading files...</p> : error ? <p className="error">{error}</p> : <FileList files={files} onDelete={handleDelete} />}
    </div>
  );
};

export default TaskFilesPage;
