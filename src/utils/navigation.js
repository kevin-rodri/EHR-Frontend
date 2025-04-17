/*
Name: Kevin Rodriguez 
Date: 3/16/25
Remarks: File that accounts for all of the possible links throughout the application.
TO-DO: Add more comments.
*/
import PeopleIcon from "@mui/icons-material/People";
import HistoryIcon from "@mui/icons-material/History";
import MedicationIcon from "@mui/icons-material/Medication";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import EvStationIcon from "@mui/icons-material/EvStation";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import ScaleIcon from "@mui/icons-material/Scale";
import NotesIcon from "@mui/icons-material/Note";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import { DirectionsRun, Output } from "@mui/icons-material";
import { Biotech } from "@mui/icons-material";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import ScienceIcon from "@mui/icons-material/Science";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import AirIcon from "@mui/icons-material/Air";
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
const NAVIGATION = (sectionId, role) => {
  const nav = [];

  if (role === "ADMIN" || role === "INSTRUCTOR") {
    nav.push({
      segment: `assign`,
      title: "Patient Dashboard",
      icon: <PersonAddIcon />,
    });
  }

  nav.push(
    {
      segment: `patient-demographics/${sectionId}`,
      title: "Demographics",
      icon: <PeopleIcon />,
    },
    {
      segment: `history/${sectionId}`,
      title: "History",
      icon: <HistoryIcon />,
    },
    {
      segment: `orders/${sectionId}`,
      title: "Orders",
      icon: <MedicalInformationIcon />,
    },
    {
      segment: `mar/${sectionId}`,
      title: "MAR",
      icon: <MedicationIcon />,
    },
    {
      segment: `at-home/${sectionId}`,
      title: "At Home Medications",
      icon: <MedicalServicesIcon />,
    },
    {
      segment: `lab-values/${sectionId}`,
      title: "Lab Values",
      icon: <ScienceIcon />,
    },
    {
      segment: "patient-care",
      title: "Patient Care",
      icon: <ExpandMoreIcon />,
      children: [
        {
          segment: `waldo/${sectionId}`,
          title: "WALDO",
          icon: <LocalHospitalIcon />,
        },
        {
          segment: `iv-lines/${sectionId}`,
          title: "IV And Lines",
          icon: <EvStationIcon />,
        },
        {
          segment: `intake-output/${sectionId}`,
          title: "Intake and Output",
          icon: <Output />,
        },
        {
          segment: "head-to-toe-assessments",
          title: "Head to Toe Assessment",
          icon: <ExpandMoreIcon />,
          children: [
            {
              segment: `musculoskeletal/${sectionId}`,
              title: "Musculoskeletal",
              icon: <DirectionsRun />,
            },
            {
              segment: `gastrointestinal/${sectionId}`,
              title: "Gastrointestinal",
              icon: <Biotech />,
            },
            {
              segment: `neurological/${sectionId}`,
              title: "Neurological",
              icon: <PsychologyAltIcon />,
            },
            {
              segment: `genitourinary/${sectionId}`,
              title: "Genitourinary",
              icon: <MedicalInformationIcon />,
            },
            {
              segment: `respiratory/${sectionId}`,
              title: "Respiratory",
              icon: <AirIcon />,
            },
          ],
        },
        {
          segment: `adl/${sectionId}`,
          title: "ADL",
          icon: <DirectionsRunIcon />,
        },
      ],
    },
    {
      segment: `patient-notes/${sectionId}`,
      title: "Patient Notes",
      icon: <NotesIcon />,
    },
    {
      segment: `pain-scale/${sectionId}`,
      title: "Scenario Specific Scales",
      icon: <ScaleIcon />,
    },
    {
      segment: `/`,
      title: "Logout",
      icon: <LogoutIcon />,
    }
  );

  return nav;
};

export default NAVIGATION;