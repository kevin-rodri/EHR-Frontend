import React from "react";
import LoginPage from "./pages/Login";
import SignUpPage from "./pages/SignUp";
import EmptyPage from "./pages/EmptyPage";
import { Box } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Box>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/to-do" element={<EmptyPage />} />
          <Route path="/register" element={<SignUpPage />} />
        </Routes>
      </BrowserRouter>
      {/* < SignUpPage /> */}
    </Box>
  );
}

export default App;
