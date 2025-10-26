import "../style/main.css";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const { state, dispatch } = useAuth();
  const { user } = state;
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <header className="landing-hero">
        <div className="hero-text">
          {user ? (
            <>
              <h1>Welcome back, {user.email}!</h1>
              <p>Here's your personalized dashboard.</p>

              <div className="landing-buttons">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/taskcreation")}
                >
                  Create Task
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => navigate("/pagination")}
                >
                  View All Tasks
                </button>

                {/* Analytics Button - ADDED */}
                <button
                  className="btn btn-analytics"
                  onClick={() => navigate("/analytics")}
                >
                  View Analytics
                </button>

                <button
                  className="btn btn-outline"
                  onClick={() => dispatch({ type: "LOGOUT" })}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <h1>Welcome to Task Manager</h1>
              <p>Organize, collaborate, and achieve goals efficiently.</p>
              <div className="landing-buttons">
                <a href="/Login" className="btn btn-secondary">Sign In</a>
                <a href="/Register" className="btn btn-primary">Get Started</a>
              </div>
            </>
          )}
        </div>

        <div className="hero-image">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3209/3209745.png"
            alt="Task Management Illustration"
          />
        </div>
      </header>

      {!user && (
        <section className="features">
          <article className="feature-card">
            <div className="icon">📌</div>
            <h3>Create Tasks</h3>
            <p>Easily add tasks with priorities and deadlines.</p>
          </article>

          <article className="feature-card">
            <div className="icon">👥</div>
            <h3>Collaborate</h3>
            <p>Assign tasks and work together efficiently.</p>
          </article>

          <article className="feature-card">
            <div className="icon">📊</div>
            <h3>Analytics</h3>
            <p>Monitor productivity with insightful reports.</p>
          </article>
        </section>
      )}
    </div>
  );
};

export default LandingPage;