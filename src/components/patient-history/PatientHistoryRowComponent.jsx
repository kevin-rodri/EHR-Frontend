/*
Name: Dylan Bellinger
Date: 2/10/2025 
Remarks: The Patient History Row component for displaing each patient history, as well as editing and deleting
each history.
useImperativeHandle and useRef: https://vinodht.medium.com/call-child-component-method-from-parent-react-bb8db1112f55
*/
import React, {useState, useEffect, useImperativeHandle, forwardRef} from "react";
import { 
    TableRow,
    TextField,
    Fab,
    Typography,
    ButtonGroup, 
    TableCell
} from "@mui/material";
import { deletePatientHistory } from "../../services/patientHistoryService";
import { updatePatientHistory } from "../../services/patientHistoryService";
import { Delete, Edit } from "@mui/icons-material";
import { getUserRole } from "../../services/authService";

export default function PatientHistoryRowComponent({patientID, history, ref}) {
    /*const {
        handleSubmit,
        formState: { errors },
      } = useForm();*/

      const [access, setAccess] = useState(false);
      const [edit, setEdit] = useState(false);
      const [newDescription, setNewDescription] = useState("");

      useEffect(() => {
        const role = getUserRole();
        if (role === "ADMIN" || role === "INSTRUCTOR"){
            setAccess(true);
        }
      }, []);


      useImperativeHandle(ref, () => {
        return {
            handleUpdate
        };
      });

      async function handleUpdate() {
        try {
            updatePatientHistory(patientID, history.id, {
                type: history.type,
                title: history.title,
                description: newDescription
            }
            );
        } catch (error) {
            throw error;
        }
      }

      async function handleDelete(Id) { 
        try {
        deletePatientHistory(patientID, Id);
        } catch (error) {
            throw error;
        }
      }
    
      function handleEdit(event) {
        setNewDescription(event.target.value);
      }

      return (
        <TableRow>
            <TableCell>
            <Typography textAlign={"center"} display={"flex"} width={107}>
              {history.type}
              </Typography>
              </TableCell>
              <TableCell width={1500}>
              <TextField
                fullWidth={true}
                variant="standard"
                defaultValue={history.description}
                disabled={!edit}
                size="medium"
                onChange={handleEdit}
               sx={{
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
              </TableCell>
              <TableCell>
              <ButtonGroup sx={{ marginLeft: 2 }}>
                <Fab onClick={() => setEdit(!edit)} /*disabled={!access}*/>
                  <Edit />
                </Fab>
                <Fab onClick={() => handleDelete(history.id)} /*disabled={!access}*/>
                  <Delete />
                </Fab>
              </ButtonGroup>
              </TableCell>
        </TableRow>
      )
      
}



