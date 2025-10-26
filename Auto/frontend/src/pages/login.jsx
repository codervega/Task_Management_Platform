import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "../style/main.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: 'include' // Important for cookies
      });
      const data = await response.json();

      if (response.ok) {
        const userData = { 
          email: data.email, 
          token: data.token,
          name: data.name
        };
        
        dispatch({ type: "LOGIN", payload: userData });
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", data.token);
        
        // Set cookie with the name your backend expects
        Cookies.set("token", data.token, { 
          expires: 7, 
          path: '/',
          secure: false,
          sameSite: 'lax'
        });

        navigate("/");
        console.log("User logged in:", userData);
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
        />

        <button type="submit">Login</button>

        <p className="signup-text">
          Don't have an account? <a href="/Register">Sign Up</a>
        </p>
      </form>
    </div>
  );
};

export default Login;