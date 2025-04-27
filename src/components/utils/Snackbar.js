import { useState, useCallback } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert'; 

export const useSnackbar = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const showSnackbar = useCallback((message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);
  const SnackbarComponent = (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={() => setSnackbarOpen(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={() => setSnackbarOpen(false)}
        severity={snackbarSeverity}
        sx={{ width: "100%" }}
      >
        {snackbarMessage}
      </Alert>
    </Snackbar>
  );
  return { showSnackbar, SnackbarComponent };
};