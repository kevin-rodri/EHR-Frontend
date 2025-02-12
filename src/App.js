import React from "react";
import LoginPage from "./pages/Login";
import SignUpPage from "./pages/SignUp";
import EmptyPage from "./pages/EmptyPage";
import PatientHistory from "./pages/patient-history/PatientHistoryPage";
import { Box, Switch } from "@mui/material";
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
          </Routes>
      </BrowserRouter>
      {/* < SignUpPage /> */}
    </Box>
  );
}

export default App;
