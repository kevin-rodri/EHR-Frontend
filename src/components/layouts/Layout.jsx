import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useMediaQuery } from "@mui/material";
import { getSectionId } from "../../services/authService";
import { useEffect, useState } from "react";
import NAVIGATION from "../../utils/navigation";
import { Link } from "react-router-dom";
import { PatientBannerComponent } from "../patients/PatientBannerComponent";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { logout } from "../../services/authService";
import { useLocation } from "react-router-dom";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme }) => ({
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    variants: [
      {
        props: ({ open }) => open,
        style: {
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginLeft: 0,
        },
      },
    ],
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function Layout({ children }) {
  const theme = useTheme();
  const location = useLocation();
  const [sectionId, setSectionId] = useState(null);
  const [open, setOpen] = React.useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [navigationItems, setNavigationItems] = useState([]);

  useEffect(() => {
    const storedSectionId = getSectionId();
    if (storedSectionId != null) {
      setSectionId(storedSectionId);
      setNavigationItems(NAVIGATION(storedSectionId));
    }
    setOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  const renderNavItem = (item, index) => {
    if (item.children) {
      return (
        <Accordion key={index} sx={{ boxShadow: "none" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{item.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {item.children.map((child, childIndex) =>
                renderNavItem(child, `${index}-${childIndex}`)
              )}
            </List>
          </AccordionDetails>
        </Accordion>
      );
    }

    return item.title === "Logout" ? (
      <ListItemButton key={index} onClick={handleLogout} to={`/`}>
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.title} />
      </ListItemButton>
    ) : (
      <ListItemButton key={index} component={Link} to={`/${item.segment}`}>
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.title} />
      </ListItemButton>
    );
  };

  return (
    <Box sx={{ display: "flex", gap: isMobile ? 0 : 2 }}>
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{ backgroundColor: "white", color: "black" }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={[{ mr: 2 }, open && { display: "none" }]}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              EHR Application
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Typography
            sx={{
              fontFamily: "Roboto",
              fontWeight: "bold",
              fontSize: 15,
              textAlign: "start",
              flexGrow: 1,
            }}
          >
            EHR Application Menu
          </Typography>

          {isMobile && (
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          )}
        </DrawerHeader>
        <Divider />
        <List>
          {navigationItems.map((item, index) => renderNavItem(item, index))}
        </List>
      </Drawer>
      <Main open={open}>
        {location.pathname !== "/assign" && (
          <PatientBannerComponent sectionId={sectionId} />
        )}
        {children}
      </Main>
    </Box>
  );
}
