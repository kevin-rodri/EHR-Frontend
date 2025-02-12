import React from "react";
import { Drawer, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function NavBar() {
    return(
        <Drawer 
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            //flexShrink: 0
        }}
        variant="permanent"
        anchor="left">
            <List>
                <Typography
                fontFamily={"Roboto"}
                sx={{
                    fontFamily: "Roboto",
                    fontSize: 15,
                    marginLeft: 2,
                    marginRight: 4,
                    marginBottom: 4,
                    marginTop: 2
                }}>
                    EHR Application Menu
                </Typography>
                <ListItem button component={Link} to={'/history'}>
                    <ListItemText primary="History" 
                    sx={{
                        fontFamily: "Roboto",
                        color: "black"
                    }}/>
                </ListItem>
            </List>
        </Drawer>
    )
}