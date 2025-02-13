import React from "react";
import LoginPage from "./pages/Login";
import SignUpPage from "./pages/SignUp";
import EmptyPage from "./pages/EmptyPage";
import PatientHistory from "./pages/patient-history/PatientHistoryPage";
import PatientAssignment from "./pages/PatientAssignment";
import { Box } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/nav/SideNavComponent";

function App() {
  return (
    <Box>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/to-do" element={<EmptyPage />} />
          <Route path="/register" element={<SignUpPage />} />
          <Route path="/history" element={<PatientHistory />} />
          <Route path="/assign" element={<PatientAssignment />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
