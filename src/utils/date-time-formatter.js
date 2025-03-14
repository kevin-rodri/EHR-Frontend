import dayjs from "dayjs";

// An exmaple: 03/18/2025 05:00 PM
export const formatDateTime = (isoString) => {
  if (!isoString) return "N/A"; 
  return dayjs(isoString).format("MM/DD/YYYY hh:mm A"); 
};
