/*
Name: Dylan Bellinger
Remarks: Add side nav implementation to be used throughout the application
https://mui.com/material-ui/react-drawer/?srsltid=AfmBOoo4hx8RR6AJoJzYxocI_ey4tcIje3t9A-nrsfYrLT4n_dvLbnKN
*/
import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";
import { getSectionId } from "../../services/authService";

export default function NavBar() {
  const [sectionId, setSectionId] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const storedSectionId = getSectionId();
    if (storedSectionId != null) {
      setSectionId(storedSectionId);
    }
  }, []);

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

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
            margin: 2,
          }}
        >
          EHR Application Menu
        </Typography>

        {sectionId && (
          <>
            <ListItem
              button
              component={Link}
              to={`/patient-demographics/${sectionId}`}
            >
              <ListItemText
                primary="Demographics"
                sx={{ fontFamily: "Roboto", color: "black" }}
              />
            </ListItem>
            <ListItem button component={Link} to={`/history/${sectionId}`}>
              <ListItemText
                primary="History"
                sx={{ fontFamily: "Roboto", color: "black" }}
              />
            </ListItem>
            <ListItem button component={Link} to={`/mar/${sectionId}`}>
              <ListItemText
                primary="MAR"
                sx={{ fontFamily: "Roboto", color: "black" }}
              />
            </ListItem>
            <Accordion
              expanded={expanded}
              onChange={handleAccordionChange}
              sx={{ width: "100%", boxShadow: "none" }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontFamily: "Roboto" }}>
                  Patient Care
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  <ListItem button component={Link} to={`/waldo/${sectionId}`}>
                    <ListItemText
                      primary="WALDO"
                      sx={{ fontFamily: "Roboto", color: "black" }}
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={Link}
                    to={`/iv-lines/${sectionId}`}
                  >
                    <ListItemText
                      primary="IV And Lines"
                      sx={{ fontFamily: "Roboto", color: "black" }}
                    />
                  </ListItem>
                  <ListItem button component={Link} to={`/adl/${sectionId}`}>
                    <ListItemText
                      primary="ADL"
                      sx={{ fontFamily: "Roboto", color: "black" }}
                    />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
          </>
        )}
        <ListItem button component={Link} to={`/patient-notes/${sectionId}`}>
          <ListItemText
            primary="Patient Notes"
            sx={{ fontFamily: "Roboto", color: "black" }}
          />
        </ListItem>
        <ListItem button component={Link} to={`/patient-orders/${sectionId}`}>
          <ListItemText
            primary="Patient Orders"
            sx={{ fontFamily: "Roboto", color: "black" }}
          />
        </ListItem>
      </List>
    </Drawer>
  );
}
