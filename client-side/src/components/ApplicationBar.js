import { AppBar, Toolbar, Typography } from "@mui/material";
import React from "react";

const ApplicationBar = () => {
    return (
        React.createElement(AppBar, null,
            React.createElement(Toolbar, null,
                React.createElement(Typography, { 
                    variant: "h5", 
                    component: "div", 
                    style: { textAlign: "center", width: "100%" } 
                }, 
                "Stock Movement Forecaster App with Complaint Analysis")
            )
        )
    );
}

export default ApplicationBar;