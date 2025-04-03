// Gabby pierce
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import GenitourinaryInfoComponent from "../../components/assessments/genitourinary/GenitourinaryInfoComponent";

export default function GenitourinaryInfoPage() {
  const { sectionId } = useParams();

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography
        variant="h2"
        fontFamily="Roboto"
        color="white"
        marginBottom={5}
        marginTop={5}
        alignSelf="center"
      >
        Genitourinary Assessment
      </Typography>
      <GenitourinaryInfoComponent sectionId={sectionId} />
    </Box>
  );
}
