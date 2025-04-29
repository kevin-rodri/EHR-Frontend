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
import PatientOrdersPage from "./pages/patient-orders/PatientOrdersPage";
import MusculoskeletalSystem from "./pages/musculoskeletal-system/MusculoskeletalSystemPage";
import GastrointestinalSystemPage from "./pages/gastrointestinal/GastrointestinalSystemPage";
import PainScalePage from "./pages/pain-scale/PainScalePage";
import Layout from "./components/layouts/Layout";
import LabValuesPage from "./pages/LabValues/LabValuesPage";
import NeurologicalSystemPage from "./pages/NeurologicalSystem/NeurologicalSystemPage";
import GenitourinaryInfoPage from "./pages/genitourinary/GenitourinaryInfoPage";
import RespiratorySystemPage from "./pages/respiratory/RespiratorySystemPage";
import AtHomeMedicationPage from "./pages/at-home-medication/AtHomeMedicationPage";
import IntakeAndOutputPage from "./pages/intake-output/IntakeAndOutputPage";
import NotFoundPage from "./pages/not-found/NotFoundPage";
import theme from "./utils/font-theme";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";


function App() {
  return (
    <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Routes>
        {/* Routes without Layout */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />

        {/* Routes with Layout 
        musculoskeletal/032c51d8-dea1-11ef-b75f-fa63d398c461
        */}
        <Route
          element={
            <Layout />
              }>
                <Route path="/assign" element={<PatientAssignment />} />
                <Route
                  path="/mar/:sectionId"
                  element={<MedicalAdministrationRecord />}
                />
                <Route
                  path="/patient-demographics/:sectionId"
                  element={<PatientDemographicsPage />}
                />
                <Route
                  path="/iv-lines/:sectionId"
                  element={<IVandLinesPage />}
                />
                <Route
                  path="/history/:sectionId"
                  element={<PatientHistory />}
                />
                <Route
                  path="/waldo/:sectionId"
                  element={<PatientWaldoPage />}
                />
                <Route path="/adl/:sectionId" element={<PatientADLPage />} />
                <Route
                  path="/patient-notes/:sectionId"
                  element={<PatientNotesPage />}
                />
                <Route
                  path="/orders/:sectionId"
                  element={<PatientOrdersPage />}
                />
                <Route
                  path="/musculoskeletal/:sectionId"
                  element={<MusculoskeletalSystem />}
                />
                <Route
                  path="/gastrointestinal/:sectionId"
                  element={<GastrointestinalSystemPage />}
                />
                <Route
                  path="/pain-scale/:sectionId"
                  element={<PainScalePage />}
                />
                <Route
                  path="/lab-values/:sectionId"
                  element={<LabValuesPage />}
                />
                <Route
                  path="/neurological/:sectionId"
                  element={<NeurologicalSystemPage />}
                />
                <Route
                  path="/genitourinary/:sectionId"
                  element={<GenitourinaryInfoPage />}
                />
                <Route
                  path="/respiratory/:sectionId"
                  element={<RespiratorySystemPage />}
                />
                <Route
                  path="/at-home/:sectionId"
                  element={<AtHomeMedicationPage />}
                />
                <Route
                  path="/intake-output/:sectionId"
                  element={<IntakeAndOutputPage />}
                />
                </Route>
              <Route path="*" element={<NotFoundPage />} />
          </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
