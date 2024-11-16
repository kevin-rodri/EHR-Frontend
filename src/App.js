import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

function App() {
  // creates a theme - this will have to change. (Ideally, we don't want this here.)
  const theme = createTheme({
    palette: {
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#dc004e",
      },
    },
    typography: {
      h3: {
        fontWeight: "bold",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div style={{ padding: "1.25rem", textAlign: "center" }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to the EHR Application!
        </Typography>
        <Button variant="contained" color="primary">
          Click Me
        </Button>
      </div>
    </ThemeProvider>
  );
}

export default App;
