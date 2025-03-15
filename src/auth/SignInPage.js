import { SignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import "./auth-styles.css"; // Added CSS import

export default function SignInPage() {
  const navigate = useNavigate();

  return (
    <div className="signin-container">
      <h1>Welcome Back</h1>
      <p>Sign in to manage your finances</p>
      
      <SignIn 
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        redirectUrl="/dashboard"
      />
      
      <p className="signup-link">
        Don't have an account? <button onClick={() => navigate("/sign-up")}>Sign Up</button>
      </p>
    </div>
  );
}
