// //Gabby Pierce
// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Box,
//   Menu,
//   MenuItem,
//   Checkbox,
//   TextField,
//   Modal,
//   Button,
//   Typography,
//   InputLabel,
// } from "@mui/material";
// import { Add, Label } from "@mui/icons-material";
// import {
//   addADLRecord,
//   deleteADLRecord,
//   getADLRecords,
//   updateADLRecord,
// } from "../../services/patientADLService";
// import { getSectionPatientById } from "../../services/sectionPatientService";
// import dayjs from "dayjs";
// import MoreVertIcon from "@mui/icons-material/MoreVert";

// export default function PatientADLComponent({ sectionId }) {
//   const [sectionPatientId, setSectionPatientId] = useState(null);
//   const [adlRecords, setAdlRecords] = useState([]);
//   const [scheduledTimes, setScheduledTimes] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedTime, setSelectedTime] = useState(null);
//   const [selectedRecordId, setSelectedRecordId] = useState(null);
//   const [editingRecordId, setEditingRecordId] = useState(null);
//   const [newRecord, setNewRecord] = useState({
//     has_bathed: false,
//     reposition: "",
//     elimination_needed: "",
//     is_meal_given: false,
//     amount_meal_consumed: "0.00",
//   });

//   useEffect(() => {
//     fetchSectionPatientId();
//   }, [sectionId]);

//   /*
//   For educational purposes: This is the process behind getting data from our endpoints: 
//   1. We get the section id from the url. 
//   2. We set the section patient based on what we get from the backend
//   3. We call the endpoint we're interested in (i.e. ADL record) and pass in the retrieved section patient id.
//   */
//   const fetchSectionPatientId = async () => {
//     try {
//       const sectionPatient = await getSectionPatientById(sectionId);
//       const records = await getADLRecords(sectionPatient.id);
//       setAdlRecords(records);
//       setScheduledTimes(
//         records.map((record) => ({
//           fullTimestamp: record.created_date,
//           displayTime: dayjs(record.created_date).format("HH:mm:ss"),
//         }))
//       );
//       setSectionPatientId(sectionPatient.id);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // Open Add Modal
//   const handleOpenModal = () => {
//     setModalOpen(true);
//   };

//   // Close Add Modal
//   const handleCloseModal = () => {
//     setModalOpen(false);
//     setNewRecord({
//       has_oral_care: false,
//       has_bathed: false,
//       reposition: "",
//       elimination_needed: "",
//       is_meal_given: false,
//       amount_meal_consumed: "0.00",
//     });
//   };

//   // Save new ADL record
//   const handleSaveRecord = async () => {
//     try {
//       const formattedData = {
//         has_oral_care: 0,
//         has_bathed: newRecord.has_bathed ? 1 : 0,
//         reposition: newRecord.reposition || "",
//         elimination_needed: newRecord.elimination_needed || "",
//         is_meal_given: newRecord.is_meal_given ? 1 : 0,
//         amount_meal_consumed: parseFloat(
//           newRecord.amount_meal_consumed
//         ).toFixed(2),
//       };

//       const response = await addADLRecord(sectionPatientId, formattedData);

//       setAdlRecords((prevRecords) => [
//         ...prevRecords,
//         {
//           ...formattedData,
//           created_date: dayjs().toISOString(),
//           id: response.id,
//         },
//       ]);

//       setScheduledTimes((prevTimes) => [
//         ...prevTimes,
//         {
//           fullTimestamp: dayjs().toISOString(),
//           displayTime: dayjs().format("HH:mm:ss"),
//         },
//       ]);

//       handleCloseModal();
//     } catch (error) {
//       console.error("Error adding ADL record:", error);
//     }
//   };

//   const handleDeleteADLRecord = async (id) => {
//     try {
//       await deleteADLRecord(sectionPatientId, id);

//       // Update UI state by filtering out the deleted record
//       setAdlRecords((prevRecords) => prevRecords.filter((r) => r.id !== id));

//       // Also update scheduled times to remove the deleted record
//       setScheduledTimes((prevTimes) =>
//         prevTimes.filter(
//           (t) =>
//             !adlRecords.some(
//               (r) => r.id === id && r.created_date === t.fullTimestamp
//             )
//         )
//       );
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleUpdateADLRecord = async (id, data) => {
//     try {
//       const response = await updateADLRecord(sectionPatientId, id, data);
//       // update the adl records we display
//       setAdlRecords((prevRecords) =>
//         prevRecords.map((r) => (r.id === id ? { ...r, ...response } : r))
//       );
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleMenuOpen = (event, time) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedTime(time);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedTime(null);
//   };

//   return (
//     <Box
//       sx={{
//         position: "relative",
//         backgroundColor: "white",
//         borderRadius: 2,
//         padding: 2,
//       }}
//     >
//       <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Patient ADL</TableCell>
//               {scheduledTimes.map((timeObj) => (
//                 <TableCell key={timeObj.fullTimestamp} align="center">
//                   {timeObj.displayTime}
//                   {/* A change in the Figma: It probably makes sense to make the cell an update */}
//                   <IconButton
//                     size="small"
//                     onClick={(event) =>
//                       handleMenuOpen(event, timeObj.fullTimestamp)
//                     }
//                   >
//                     <MoreVertIcon />
//                   </IconButton>

//                   <Menu
//                     anchorEl={anchorEl}
//                     open={Boolean(anchorEl) && selectedTime !== null}
//                     onClose={handleMenuClose}
//                   >
//                     {/* Delete Method */}
//                     <MenuItem
//                       onClick={() => {
//                         const recordToDelete = adlRecords.find(
//                           (record) => record.created_date === selectedTime
//                         );
//                         if (recordToDelete) {
//                           handleDeleteADLRecord(recordToDelete.id);
//                         }
//                         handleMenuClose();
//                       }}
//                     >
//                       Delete
//                     </MenuItem>
//                   </Menu>
//                 </TableCell>
//               ))}
//               <TableCell align="center">
//                 <IconButton onClick={handleOpenModal}>
//                   <Add />
//                 </IconButton>
//               </TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {[
//               { key: "has_bathed", label: "Bathing" },
//               { key: "reposition", label: "Reposition" },
//               { key: "elimination_needed", label: "Elimination Need" },
//               { key: "is_meal_given", label: "Meal Given" },
//               { key: "amount_meal_consumed", label: "% of Meal Consumed" },
//             ].map(({ key, label }) => (
//               <TableRow key={key}>
//                 <TableCell>{label}</TableCell>
//                 {adlRecords.map((record) => (
//                   <TableCell
//                     key={`${key}-${record.created_date}`}
//                     align="center"
//                   >
//                     {key === "has_bathed" || key === "is_meal_given" ? (
//                       <Checkbox
//                         checked={record?.[key] || false}
//                         onChange={(e) =>
//                           handleUpdateADLRecord(record.id, {
//                             [key]: e.target.checked,
//                           })
//                         }
//                       />
//                     ) : (
//                       <TextField
//                         variant="outlined"
//                         size="small"
//                         value={record?.[key] || ""}
//                         onChange={(e) =>
//                           setAdlRecords((prevRecords) =>
//                             prevRecords.map((r) =>
//                               r.id === record.id
//                                 ? { ...r, [key]: e.target.value }
//                                 : r
//                             )
//                           )
//                         }
//                         onBlur={() =>
//                           handleUpdateADLRecord(record.id, {
//                             [key]: record[key],
//                           })
//                         }
//                       />
//                     )}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Modal for Adding New Record */}
//       <Modal open={modalOpen} onClose={handleCloseModal}>
//         <Box
//           sx={{
//             width: 400,
//             padding: 3,
//             backgroundColor: "white",
//             margin: "auto",
//             marginTop: "10%",
//             borderRadius: 2,
//             boxShadow: 3,
//           }}
//         >
//           <Typography variant="h6" gutterBottom textAlign="center">
//             Add New ADL Record
//           </Typography>
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: 1,
//             }}
//           >
//             <Checkbox
//               checked={newRecord.has_bathed}
//               onChange={(e) =>
//                 setNewRecord({ ...newRecord, has_bathed: e.target.checked })
//               }
//             />
//             <Typography variant="body1">Has Bathed</Typography>
//           </Box>

//           <TextField
//             label="Reposition"
//             fullWidth
//             margin="normal"
//             value={newRecord.reposition}
//             onChange={(e) =>
//               setNewRecord({ ...newRecord, reposition: e.target.value })
//             }
//           />
//           <TextField
//             label="Elimination Need"
//             fullWidth
//             margin="normal"
//             value={newRecord.elimination_needed}
//             onChange={(e) =>
//               setNewRecord({ ...newRecord, elimination_needed: e.target.value })
//             }
//           />
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: 1,
//             }}
//           >
//             <Checkbox
//               checked={newRecord.is_meal_given}
//               onChange={(e) =>
//                 setNewRecord({ ...newRecord, is_meal_given: e.target.checked })
//               }
//             />
//             <Typography variant="body1">Meal Given</Typography>
//           </Box>

//           <TextField
//             label="% of Meal Consumed"
//             fullWidth
//             margin="normal"
//             value={newRecord.amount_meal_consumed}
//             onChange={(e) =>
//               setNewRecord({
//                 ...newRecord,
//                 amount_meal_consumed: e.target.value,
//               })
//             }
//           />
//           <Box display="flex" justifyContent="center" mt={2}>
//             <Button
//               onClick={handleCloseModal}
//               color="error"
//               sx={{ marginRight: 1 }}
//             >
//               Cancel
//             </Button>
//             <Button onClick={handleSaveRecord} color="primary">
//               Save
//             </Button>
//           </Box>
//         </Box>
//       </Modal>
//     </Box>
//   );
// }

import React, { useEffect, useState, useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  TextField,
  Button,
  Checkbox,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  addADLRecord,
  deleteADLRecord,
  getADLRecords,
  updateADLRecord,
} from "../../services/patientADLService";
import { getSectionPatientById } from "../../services/sectionPatientService";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Setup timezone
dayjs.extend(utc);
dayjs.extend(timezone);

export default function PatientADLComponent({ sectionId }) {
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [deletingRow, setDeletingRow] = useState(null);
  const [adlRecords, setAdlRecords] = useState([]);
  const [sectionPatientId, setSectionPatientId] = useState(null);

  const [newADLRecord, setNewADLRecord] = useState({
    id: "",
    has_bathed: false,
    reposition: "",
    elimination_needed: "",
    is_meal_given: false,
    amount_meal_consumed: "0.00",
    created_date: dayjs().tz("America/New_York").format("YYYY-MM-DD HH:mm:ss"),
  });

  useEffect(() => {
    fetchSectionPatientId();
  }, [sectionId]);

  const fetchSectionPatientId = async () => {
    try {
      const sectionPatient = await getSectionPatientById(sectionId);
      const records = await getADLRecords(sectionPatient.id);
      setAdlRecords(records);
      setSectionPatientId(sectionPatient.id);
    } catch (error) {
      console.error(error);
    }
  };

  // Open Modal for Add/Edit/Delete
  const handleOpenModal = (row = null, action = "edit") => {
    if (action === "edit") {
      setEditingRow(row);
      if (row) {
        setNewADLRecord({
          id: row.original.id,
          has_bathed: row.original.has_bathed,
          reposition: row.original.reposition,
          elimination_needed: row.original.elimination_needed,
          is_meal_given: row.original.is_meal_given,
          amount_meal_consumed: row.original.amount_meal_consumed,
          created_date: row.original.created_date,
        });
      } else {
        setNewADLRecord({
          id: "",
          has_bathed: false,
          reposition: "",
          elimination_needed: "",
          is_meal_given: false,
          amount_meal_consumed: "0.00",
          created_date: dayjs().tz("America/New_York").format("YYYY-MM-DD HH:mm:ss"),
        });
      }
      setOpenModal(true);
    } else if (action === "delete") {
      setDeletingRow(row);
      setOpenDeleteModal(true);
    }
  };

  // Save ADL Record (Create/Update)
  const handleSave = async () => {
    try {
      if (editingRow) {
        await updateADLRecord(sectionPatientId, editingRow.original.id, newADLRecord);

        setAdlRecords((prevData) =>
          prevData.map((item) =>
            item.id === editingRow.original.id ? { ...item, ...newADLRecord } : item
          )
        );
      } else {
        const response = await addADLRecord(sectionPatientId, newADLRecord);

        setAdlRecords((prevData) => [
          ...prevData,
          { ...newADLRecord, id: response.id },
        ]);
      }

      setOpenModal(false);
    } catch (error) {
      console.error("Error saving ADL record:", error);
    }
  };

  // Delete ADL Record
  const handleDelete = async () => {
    try {
      await deleteADLRecord(sectionPatientId, deletingRow.original.id);
      setAdlRecords(adlRecords.filter((item) => item.id !== deletingRow.original.id));
      setOpenDeleteModal(false);
    } catch (error) {
      console.error("Error deleting ADL record:", error);
    }
  };

  // **Transform Data to Pivot Table Format**
  const transformedData = useMemo(() => {
    const uniqueTimes = [...new Set(adlRecords.map((r) => r.created_date))].sort();
    const categories = [
      { key: "has_bathed", label: "Bathing" },
      { key: "reposition", label: "Reposition" },
      { key: "elimination_needed", label: "Elimination Need" },
      { key: "is_meal_given", label: "Meal Given" },
      { key: "amount_meal_consumed", label: "% of Meal Consumed" },
    ];

    return categories.map((category) => {
      const rowData = { category: category.label };

      uniqueTimes.forEach((time) => {
        const record = adlRecords.find((r) => r.created_date === time);
        if (record) {
          rowData[time] =
            category.key === "has_bathed" || category.key === "is_meal_given"
              ? record[category.key]
                ? "✔"
                : "✖"
              : record[category.key] || "N/A";
        } else {
          rowData[time] = "N/A";
        }
      });

      return rowData;
    });
  }, [adlRecords]);

  // Define Columns (Timestamps as Headers)
  const columns = useMemo(() => {
    const uniqueTimes = [...new Set(adlRecords.map((r) => r.created_date))].sort();
    
    return [
      { accessorKey: "category", header: "Patient ADL", size: 200 },
      ...uniqueTimes.map((time) => ({
        accessorKey: time,
        header: `${dayjs(time).tz("America/New_York").format("HH:mm:ss")}`,
        size: 150,
        enableSorting: false
      })),
      {
        accessorKey: "actions",
        header: "Actions",
        size: 150,
        enableSorting: false,
        Cell: ({ row }) => (
          <Box>
            <Tooltip title="Edit">
              <IconButton onClick={() => handleOpenModal(row, "edit")}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton color="error" onClick={() => handleOpenModal(row, "delete")}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ];
  }, [adlRecords]);
  

  const table = useMaterialReactTable({
    columns,
    data: transformedData,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableColumnFilters: false,
    enableFilterMatchHighlighting: false,
  });

  return (
    <Box>
      <MaterialReactTable table={table} />

      {/* Modal for Create/Edit */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle align="center">
          {editingRow ? "Edit ADL Record" : "Add ADL Record"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="error">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            {editingRow ? "Save" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

