import React, {useState, useEffect, useForm} from "react";
import { 
    TableRow,
    TextField,
    Fab,
    Typography,
    ButtonGroup, 
    TableCell,
    FormControl
} from "@mui/material";
import { getSectionPatientById } from "../../services/sectionPatientService";
import { getPatientHistory } from "../../services/patientHistoryService";
import { deletePatientHistory } from "../../services/patientHistoryService";
import { updatePatientHistory } from "../../services/patientHistoryService";
import { Delete, Edit } from "@mui/icons-material";
import { getUserRole } from "../../services/authService";

export default function PatientHistoryRowComponent({patientID, history}) {
    /*const {
        handleSubmit,
        formState: { errors },
      } = useForm();*/

      const [access, setAccess] = useState(false);
      const [edit, setEdit] = useState(false);
      const [newHistory, setNewHistory] = useState(history);

      useEffect(() => {
        const role = getUserRole();
        if (role === "ADMIN" || role === "INSTRUCTOR"){
            setAccess(true);
        }
      }, []);

      function handleUpdate() {
        updatePatientHistory(patientID, history.id, newHistory);
      }

      function handleDelete(Id) {
        deletePatientHistory(patientID, Id);
      }
    
      function handleEdit(desc) {
        setNewHistory((prev) => ({...prev, descrption: desc}));
      }

      return (
        <TableRow>
            <TableCell>
            <Typography textAlign={"center"} display={"flex"} width={107}>
              {history.type}
              </Typography>
              </TableCell>
              <TableCell width={1000}>
              <TextField
                fullWidth={true}
                variant="standard"
                value={history.description}
                disabled={!edit}
                size="medium"
                onChange={(e) =>
                  handleEdit(e.target.value)
                }
               sx={{
                  //width: "auto",
                  "& .MuiInput-underline:before, & .MuiInput-underline:after": {
                    display: "none",
                  },
                  "& .MuiInputBase-input": {
                    padding: 0,
                    width: `${
                      (history.descrption || "").toString().length -
                        1 || 1
                    }rem`,
                  },
                }}
              />
              {  /*</TableCell>{history.descrption}
              </TextField>*/}
              </TableCell>
              <TableCell>
              <ButtonGroup sx={{ marginLeft: 2 }}>
                <Fab onClick={() => setEdit(!edit)} disabled={!access}>
                  <Edit />
                </Fab>
                <Fab onClick={() => handleDelete(history.id)} disabled={!access}>
                  <Delete />
                </Fab>
              </ButtonGroup>
              </TableCell>
        </TableRow>
      )
      
}



