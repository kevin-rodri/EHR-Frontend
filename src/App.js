import React from "react";
import LoginPage from "./pages/auth/Login";
import SignUpPage from "./pages/auth/SignUp";
import PatientDemographicsPage from "./pages/patient-demographics/PatientDemographics";
import PatientHistory from "./pages/patient-history/PatientHistoryPage";
import PatientAssignment from "./pages/section/PatientAssignment";
import PatientWaldoPage from "./pages/waldo/PatientWaldoPage";
import PatientADLPage from "./pages/adl/PatientADLPage";
import PatientNotesPage from "./pages/patient-notes/PatientNotesPage";
import { Box } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
          <Route path="/history/:sectionId" element={<PatientHistory />} />
          <Route path="/waldo/:sectionId" element={<PatientWaldoPage />} />
          <Route path="/adl/:sectionId" element={<PatientADLPage />} />
          <Route path="/patient-notes/:sectionId" element={<PatientNotesPage />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
