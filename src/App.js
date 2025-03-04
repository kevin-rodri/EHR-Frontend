import React from "react";
import LoginPage from "./pages/auth/Login";
import SignUpPage from "./pages/auth/SignUp";
import PatientDemographicsPage from "./pages/patient-demographics/PatientDemographics";
import PatientHistory from "./pages/patient-history/PatientHistoryPage";
import PatientAssignment from "./pages/section/PatientAssignment";
import { Box } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IVandLinesPage from "./pages/IVandLines/IVandLinesPage";

function App() {
  return (
    <Box>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<SignUpPage />} />
          <Route path="/assign" element={<PatientAssignment />} />
          <Route
            path="/patient-demographics/:sectionId"
            element={<PatientDemographicsPage />}
          />
          <Route path="/patient/:sectionId/iv-lines" element={<IVandLinesPage/>}/>
          <Route path="/history/:sectionId" element={<PatientHistory />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
