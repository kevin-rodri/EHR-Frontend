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
import NotesIcon from "@mui/icons-material/Note";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import { DirectionsRun } from "@mui/icons-material";
import { Biotech } from "@mui/icons-material";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";

const NAVIGATION = (sectionId) => [
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
    icon: <MedicationIcon />,
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
    segment: `/`,
    title: "Logout",
    icon: <LogoutIcon />,
  },
];

export default NAVIGATION;
