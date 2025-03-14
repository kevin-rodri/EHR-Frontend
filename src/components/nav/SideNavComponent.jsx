import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PeopleIcon from "@mui/icons-material/People";
import HistoryIcon from "@mui/icons-material/History";
import MedicationIcon from "@mui/icons-material/Medication";
import NotesIcon from "@mui/icons-material/Note";
import CollapseIcon from "@mui/icons-material/ChevronLeft";
import ExpandIcon from "@mui/icons-material/ChevronRight";
import { Link } from "react-router-dom";
import { getSectionId } from "../../services/authService";

export default function NavBar() {
  const [sectionId, setSectionId] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false); // New state for sidebar collapse

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const storedSectionId = getSectionId();
    if (storedSectionId != null) {
      setSectionId(storedSectionId);
    }
  }, []);

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCollapseToggle = () => {
    setCollapsed(!collapsed);
  };

  // Sidebar Content
  const drawerContent = (
    <List sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Typography
        sx={{
          fontFamily: "Roboto",
          fontWeight: "bold",
          fontSize: 15,
          margin: 2,
          textAlign: collapsed ? "center" : "left",
        }}
      >
        {collapsed ? "EHR" : "EHR Application Menu"}
      </Typography>

      {sectionId && (
        <>
          <ListItem button component={Link} to={`/patient-demographics/${sectionId}`}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText primary="Demographics" sx={{ fontFamily: "Roboto", color: "black" }} />
            )}
          </ListItem>
          <ListItem button component={Link} to={`/history/${sectionId}`}>
            <ListItemIcon>
              <HistoryIcon />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText primary="History" sx={{ fontFamily: "Roboto", color: "black" }} />
            )}
          </ListItem>
          <ListItem button component={Link} to={`/mar/${sectionId}`}>
            <ListItemIcon>
              <MedicationIcon />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="MAR" sx={{ fontFamily: "Roboto", color: "black" }} />}
          </ListItem>

          {!collapsed && (
            <Accordion expanded={expanded} onChange={handleAccordionChange} sx={{ boxShadow: "none" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontFamily: "Roboto" }}>Patient Care</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  <ListItem button component={Link} to={`/waldo/${sectionId}`}>
                    <ListItemText primary="WALDO" sx={{ fontFamily: "Roboto", color: "black" }} />
                  </ListItem>
                  <ListItem button component={Link} to={`/iv-lines/${sectionId}`}>
                    <ListItemText primary="IV And Lines" sx={{ fontFamily: "Roboto", color: "black" }} />
                  </ListItem>
                  <ListItem button component={Link} to={`/adl/${sectionId}`}>
                    <ListItemText primary="ADL" sx={{ fontFamily: "Roboto", color: "black" }} />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
          )}
        </>
      )}

      <ListItem button component={Link} to={`/patient-notes/${sectionId}`}>
        <ListItemIcon>
          <NotesIcon />
        </ListItemIcon>
        {!collapsed && <ListItemText primary="Patient Notes" sx={{ fontFamily: "Roboto", color: "black" }} />}
      </ListItem>

      {/* Collapse Button at the Bottom */}
      <ListItem sx={{ marginTop: "auto", justifyContent: "end" }}>
        <IconButton onClick={handleCollapseToggle}>
          {collapsed ? <ExpandIcon /> : <CollapseIcon />}
        </IconButton>
      </ListItem>
    </List>
  );

  return (
    <>
      {/* Show AppBar with Hamburger Icon only on Mobile */}
      {isMobile && (
        <AppBar position="fixed" sx={{ backgroundColor: "white", color: "black" }}>
          <Toolbar>
            <IconButton edge="start" color="black" aria-label="menu" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: "Roboto", color: "black" }}>
              EHR Application
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar Navigation */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        anchor="left"
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: "flex",
          flexDirection: "column",
          "& .MuiDrawer-paper": {
            width: collapsed ? 60 : 250,
            transition: "width 0.3s ease-in-out",
            overflowX: "hidden",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
