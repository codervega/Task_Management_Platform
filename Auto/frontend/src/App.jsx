import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../src/pages/landingpage";
import Navbar from "./Components/navbar";
import Footer from "./Components/footer";
import SignupForm from "./pages/signupform"; // Capitalized
import Login from "./pages/login";
import Profile from "./pages/profile";
import Taskcreation from "./pages/taskcreation";
import TaskList from "./pages/TaskList";
import TaskFilesPage from "./pages/TaskFilesPage";
import CommentsPage from "./pages/CommentsPage";
import Analytics from "./pages/AnalyticsPage";

const App = () => {
  return (
    <BrowserRouter basename="/">
    
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Register" element={<SignupForm />} /> {/* Capitalized */}
         <Route path="/Login" element={<Login/>} />
        <Route path="/profile" element={<Profile />} /> // ✅ CORRECT
        <Route path="/pagination" element={<TaskList />} /> 
        <Route path="/taskcreation" element={<Taskcreation />} /> 
        <Route path="/task/:taskId" element={<TaskFilesPage />} />
        <Route path="/task/:taskId/comments" element={<CommentsPage />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
