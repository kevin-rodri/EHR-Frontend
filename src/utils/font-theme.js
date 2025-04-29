/*
Name: Kevin Rodriguez
Date: 4/27/25
Remarks: Utils file that takes all the font sizes from our material Ui components and increases theme by 1.25. Feel free to increase it to your liking!
Source: https://v4.mui.com/customization/typography/
*/
import { createTheme } from "@mui/material/styles";

const baseTheme = createTheme();

const scale = 1.30;

const bodyVariants = [
    "body1",
    "body2",
    "subtitle1",
    "subtitle2",
    "caption",
    "overline",
    "button",
  ];

const scaledTypography = {};
bodyVariants.forEach((variant) => {
  const originalSize = parseFloat(baseTheme.typography[variant]?.fontSize || 1);
  scaledTypography[variant] = {
    fontSize: `${originalSize * scale}rem`,
  };
});

const theme = createTheme({
  typography: {
    ...scaledTypography,
  },
});

export default theme;
