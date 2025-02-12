import React from "react";
import LoginPage from "./pages/Login";
import SignUpPage from "./pages/SignUp";
import PatientDemographicsPage from "./pages/patient-demographics";
import { Box } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Box>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<SignUpPage />} />
          <Route path="/patient-demographics/:id" element={<PatientDemographicsPage />} />
        </Routes>
      </BrowserRouter>
      {/* < SignUpPage /> */}
    </Box>
  );
}

export default App;
