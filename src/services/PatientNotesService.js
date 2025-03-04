//Gabby Pierce
import { axiosTokenInstance } from './httpInterceptor';

export async function getNotesForPatient(sectionId) {
  try {
    const response = await axiosTokenInstance().get(`/patients/${sectionId}/notes`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function addNoteForPatient(sectionId, noteData) {
  try {
    const response = await axiosTokenInstance().post(`/patients/${sectionId}/notes`, noteData);
    return response.data;
  } catch (error) {
    console.error("Error adding note", error);
    throw error;
  }
}

export async function updateNoteForPatient(sectionId, noteId, noteData) {
  try {
    const response = await axiosTokenInstance().put(`/patients/${sectionId}/notes/${noteId}`, noteData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteNoteForPatient(sectionId, noteId) {
  try {
    const response = await axiosTokenInstance().delete(`/patients/${sectionId}/notes/${noteId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

