import React from "react";
import { StrictMode } from 'react'
import ReactDOM from "react-dom";
import App from "./App";
import { AuthProvider } from './context/AuthContext.jsx'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </AuthProvider>
)
