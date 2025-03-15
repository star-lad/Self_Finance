import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import Dashboard from "./components/dashboard";
import SignInPage from "./auth/SignInPage";
import SignUpPage from "./auth/signup-page";
import Header from "./components/Header";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  
  if (!isLoaded) {
    return <div className="loading">Loading authentication...</div>;
  }
  
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }
  
  return children;
};

function App() {
  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <SignedIn>
              <Navigate to="/dashboard" replace />
            </SignedIn>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/sign-in" element={
            <SignedOut>
              <SignInPage />
            </SignedOut>
          } />
          
          <Route path="/sign-up" element={
            <SignedOut>
              <SignUpPage />
            </SignedOut>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
