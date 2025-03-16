/*
Name: Kevin Rodriguez
Date: 3/15/25
Remarks: Helper method that can be used throughout the application when trying to format the date and time.
*/

import dayjs from "dayjs";

// An exmaple: 03/18/2025 05:00 PM
export const formatDateTime = (isoString) => {
  if (!isoString) return "N/A"; 
  return dayjs(isoString).format("MM/DD/YYYY hh:mm A"); 
};
