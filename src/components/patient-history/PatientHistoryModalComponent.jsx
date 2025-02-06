import { 
    Button, 
    CardActions, 
    CardContent, 
    CardHeader, 
    FormControl, 
    MenuItem, 
    Modal, 
    Select, 
    TextField 
  } from "@mui/material";
  import React, { useState } from "react";
  
  
  export default function PatientHistoryModalComponent({ open, onClose }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [historyType, setHistoryType] = useState("");
  
    function handleTitle(event) {
      setTitle(event.target.value);
    }
  
    function handleDescription(event) {
      setDescription(event.target.value);
    }
  
    function handleHistoryType(event) {
      setHistoryType(event.target.value);
    }
  
    return (
      <Modal 
        open={open} 
        onClose={onClose} 
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          marginTop: "50px"
        }}
      >
        <div style={{ background: "#fff", padding: 16 }}>
          <CardHeader 
            sx={{
              display: "flex",
              alignItems: "center",
              alignSelf: "stretch"
            }}
            title="Add Patient History"
          />
          <CardContent>
            <div>
              <label>Title</label>
              <TextField 
                value={title}
                onChange={handleTitle} 
                fullWidth
              />
            </div>
            <div style={{ marginTop: 16 }}>
              <label>Description</label>
              <TextField
                value={description} 
                onChange={handleDescription}
                rows={4}
                multiline 
                fullWidth
              />
            </div>
            <div style={{ marginTop: 16 }}>
              <label>History Type</label>
              <FormControl fullWidth>
                <Select 
                  value={historyType}
                  onChange={handleHistoryType}
                >
                  <MenuItem value={"Primary Admitting Diagnosis"}>Primary Admitting Diagnosis</MenuItem>
                  <MenuItem value={"Family Heath History"}>Family Heath History</MenuItem>
                  <MenuItem value={"Social History"}>Social History</MenuItem>
                  <MenuItem value={"Medical/Surgical History"}>Medical/Surgical History</MenuItem>
                </Select>
              </FormControl>
            </div>
          </CardContent>
          <CardActions>
            <Button color="secondary" onClick={onClose}>Cancel</Button>
            <Button color="primary">Save</Button>
          </CardActions>
        </div>
      </Modal>
    );
  }
  