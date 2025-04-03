//gabby pierce
import { axiosTokenInstance } from "./httpInterceptor";

export const getGenitourinaryInfo = async (section_patient_id) => {
  try {
    const response = await axiosTokenInstance().get(
      `/assessments/${section_patient_id}/genitourinary`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching genitourinary info:", error);
    throw error;
  }
};


export const getGenitourinaryInfoAdmin = async (section_patient_id) => {
  try {
    const response = await axiosTokenInstance().get(
      `/assessments/${section_patient_id}/genitourinary/students`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching genitourinary info (admin):", error);
    throw error;
  }
};

export const addGenitourinaryInfo = async (section_patient_id, payload) => {
  try {
    const response = await axiosTokenInstance().post(
      `/assessments/${section_patient_id}/genitourinary`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error adding genitourinary info:", error);
    throw error;
  }
};

export const updateGenitourinaryInfo = async (section_patient_id, id, payload) => {
  try {
    const response = await axiosTokenInstance().put(
      `/assessments/${section_patient_id}/genitourinary/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error updating genitourinary info:", error);
    throw error;
  }
};

export const deleteGenitourinaryInfo = async (section_patient_id, id) => {
  try {
    const response = await axiosTokenInstance().delete(
      `/assessments/${section_patient_id}/genitourinary/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting genitourinary info:", error);
    throw error;
  }
};