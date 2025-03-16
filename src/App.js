import React from "react";
import LoginPage from "./pages/auth/Login";
import SignUpPage from "./pages/auth/SignUp";
import PatientDemographicsPage from "./pages/patient-demographics/PatientDemographics";
import PatientHistory from "./pages/patient-history/PatientHistoryPage";
import PatientAssignment from "./pages/section/PatientAssignment";
import PatientWaldoPage from "./pages/waldo/PatientWaldoPage";
import PatientADLPage from "./pages/adl/PatientADLPage";
import PatientNotesPage from "./pages/patient-notes/PatientNotesPage";
import MedicalAdministrationRecord from "./pages/MAR/MedicalAdministrationRecord";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IVandLinesPage from "./pages/IVandLines/IVandLinesPage";
import Layout from "./components/layouts/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes without Layout */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />

        {/* Routes with Layout */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/assign" element={<PatientAssignment />} />
                <Route
                  path="/mar/:sectionId"
                  element={<MedicalAdministrationRecord />}
                />
                <Route
                  path="/patient-demographics/:sectionId"
                  element={<PatientDemographicsPage />}
                />
                <Route path="/iv-lines/:sectionId" element={<IVandLinesPage />} />
                <Route path="/history/:sectionId" element={<PatientHistory />} />
                <Route path="/waldo/:sectionId" element={<PatientWaldoPage />} />
                <Route path="/adl/:sectionId" element={<PatientADLPage />} />
                <Route
                  path="/patient-notes/:sectionId"
                  element={<PatientNotesPage />}
                />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
