import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

const clerkKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!clerkKey) {
  console.log("Clerk Key:", process.env.REACT_APP_CLERK_PUBLISHABLE_KEY);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkKey}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);