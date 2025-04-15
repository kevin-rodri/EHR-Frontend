/*
Name: Dylan Bellinger
Date: 4/12/2025 
Remarks: 404/Not Found page for invalid URLs. 
*/
import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../services/authService";
import { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function NotFoundPage() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
    useEffect(() => {
      async function checkAuth() {
        const authStatus = await isAuthenticated(navigate);
      }
      checkAuth();
    }, [navigate]);

    return(
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", height: "100vh" }}>
            <Typography
                    variant="h2"
                    fontFamily={"Roboto"}
                    color="white"
                    alignSelf={"center"}
                    borderRight={"2px solid"}
                    paddingRight={"25px"}
                  >
                    404 
                  </Typography>
            <Typography
            variant="h2"
            fontFamily={"Roboto"}
            color="white"
            alignSelf={"center"}
            paddingLeft={"25px"}>
              This page cannot be found
            </Typography>
        </Box>
    )
}