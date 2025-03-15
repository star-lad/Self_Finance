import { SignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const navigate = useNavigate();

  return (
    <div className="signup-container">
      <h1>Create Your Account</h1>
      <p>Start tracking your finances today</p>
      
      <SignUp 
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        redirectUrl="/dashboard"
        afterSignUpUrl="/dashboard"
      />
      
      <p className="login-link">
        Already have an account? <button onClick={() => navigate("/sign-in")}>Sign In</button>
      </p>
    </div>
  );
}
