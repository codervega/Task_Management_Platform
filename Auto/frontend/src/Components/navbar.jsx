import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { state, dispatch } = useAuth();
  const { user } = state;
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/"); // redirect to landing page
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>Task Manager</div>
      <div style={styles.links}>
        {!user ? (
          <>
            <a href="/Login" style={styles.button}>Sign In</a>
            <a href="/Register" style={{ ...styles.button, ...styles.signupBtn }}>Sign Up</a>
          </>
        ) : (
          <>
            <div 
              style={styles.profile} 
              onClick={() => navigate("/profile")} // redirect on click
            >
              <span style={styles.name}>{user.name || "Profile"}</span>
              <img
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt="Profile"
                style={styles.avatar}
              />
            </div>
            <button 
              onClick={handleLogout} 
              style={{ ...styles.button, ...styles.logoutBtn }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    width: "100vw",
    maxWidth: "100%",
    boxSizing: "border-box",
    padding: "15px 40px",
    background: "#1e1e1e",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  logo: { fontSize: "22px", fontWeight: "bold" },
  links: { display: "flex", gap: "15px", alignItems: "center" },
  button: {
    padding: "8px 14px",
    textDecoration: "none",
    background: "#444",
    borderRadius: "6px",
    color: "#fff",
    fontWeight: "500",
    transition: "0.3s",
    cursor: "pointer",
    border: "none",
  },
  signupBtn: { background: "#007bff" },
  logoutBtn: { background: "#ff4d4f" },
  profile: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#333",
    padding: "5px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  name: { fontWeight: "500", color: "#fff" },
  avatar: { width: "32px", height: "32px", borderRadius: "50%" },
};

export default Navbar;
