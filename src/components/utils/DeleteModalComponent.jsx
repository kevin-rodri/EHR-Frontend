/* 
Name: Kevin Rodriguez
Date: 3/16/25 
Remarks: 
Reusable Delete Confirmation Modal component. This modal prompts users to confirm any deletion action.  
If your page or component includes delete functionality, you should use this modal to ensure user confirmation before deleting an item.
*/

import React from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";

const DeleteConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  title = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Submit",
  cancelText = "Cancel",
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle align="center">{title}</DialogTitle>
      <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
        <Button onClick={onClose} color="error" variant="contained">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color="primary" variant="contained">
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
