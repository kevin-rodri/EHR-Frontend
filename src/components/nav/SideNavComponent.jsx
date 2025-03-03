/*
Name: Dylan Bellinger
Remarks: Add side nav implementation to be used throughout the application
https://mui.com/material-ui/react-drawer/?srsltid=AfmBOoo4hx8RR6AJoJzYxocI_ey4tcIje3t9A-nrsfYrLT4n_dvLbnKN
*/
import React, { useState, useEffect } from "react";
import { Drawer, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { getSectionId } from "../../services/authService";

export default function NavBar() {
  const [sectionId, setSectionId] = useState(null);

  useEffect(() => {
    const storedSectionId = getSectionId();
    if (storedSectionId != null) {
      setSectionId(storedSectionId);
    }
  }, []);

  return (
    <Drawer
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
      variant="permanent"
      anchor="left"
    >
      <List>
        <Typography
          sx={{
            fontFamily: "Roboto",
            fontWeight: "bold",
            fontSize: 15,
            margin: 2
          }}
        >
          EHR Application Menu
        </Typography>

        {sectionId && (
          <>
            <ListItem button component={Link} to={`/patient-demographics/${sectionId}`}>
              <ListItemText primary="Demographics" sx={{ fontFamily: "Roboto", color: "black" }} />
            </ListItem>
            <ListItem button component={Link} to={`/history/${sectionId}`}>
              <ListItemText primary="History" sx={{ fontFamily: "Roboto", color: "black" }} />
            </ListItem>
            <ListItem button component={Link} to={`/waldo/${sectionId}`}>
              <ListItemText primary="WALDO" sx={{ fontFamily: "Roboto", color: "black" }} />
            </ListItem>
            <ListItem button component={Link} to={`/MAR/${sectionId}`}>
              <ListItemText primary="MAR" sx={{ fontFamily: "Roboto", color: "black" }} />
            </ListItem>
            
          </>
        )}
      </List>
    </Drawer>
  );
}