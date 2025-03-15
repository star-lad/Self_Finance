import { useUser, UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import "./header-css.css"; // Corrected import

export default function Header() {
  const { user } = useUser();
  
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <h1>Finance Planner</h1>
          </Link>
        </div>
        
        <nav className="nav-links">
          <SignedIn>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
          </SignedIn>
        </nav>
        
        <div className="auth-section">
          <SignedIn>
            <div className="user-info">
              {user && (
                <span className="welcome-message">Hello, {user.firstName || 'User'}</span>
              )}
              <UserButton />
            </div>
          </SignedIn>
          
          <SignedOut>
            <div className="auth-buttons">
              <Link to="/sign-in" className="btn-link">Sign In</Link>
              <Link to="/sign-up" className="btn-link btn-primary">Sign Up</Link>
            </div>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
