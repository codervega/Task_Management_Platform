import { createContext, useReducer, useContext, useEffect } from "react";

// Initial state - try to load from localStorage first
const getInitialState = () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      return { user: JSON.parse(storedUser) };
    }
  } catch (error) {
    console.error("Error loading stored user:", error);
    // Clear corrupted data
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
  }
  return { user: null };
};

const initialState = getInitialState();

// Reducer
function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      // Save to localStorage when logging in
      localStorage.setItem("user", JSON.stringify(action.payload));
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("email", action.payload.email);
      return { ...state, user: action.payload };
    
    case "LOGOUT":
      // Clear localStorage when logging out
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      return { ...state, user: null };
    
    case "LOAD_USER":
      // Load user from storage
      return { ...state, user: action.payload };
    
    default:
      return state;
  }
}

// Create context
const AuthContext = createContext();

// Provider
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from localStorage on component mount
  useEffect(() => {
    const loadStoredUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          dispatch({ type: "LOAD_USER", payload: userData });
        }
      } catch (error) {
        console.error("Error loading user from storage:", error);
        // Clear corrupted data
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("email");
      }
    };

    loadStoredUser();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}