import { axiosInstance, axiosTokenInstance } from "./httpInterceptor";

export async function getPatientHistory(patient_id) {
    try {
        const response = await axiosTokenInstance().get(`patients/${patient_id}/history`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function addPatientHistory(patient_id, history) {
    try {
        const response = await axiosInstance().post(
          `/patient/${patient_id}/history`,
          history
        );
        return response.data;
      } catch (error) {
        throw error; 
      }
}

export async function updatePatientHistory(patient_id, id, history) {
    try {
        const response = await axiosTokenInstance().put(`patients/${patient_id}/history/${id}`, history);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function deletePatientHistory(patient_id, id, history) {
    try {
        const response = await axiosTokenInstance().delete(`patients/${patient_id}/history/${id}`, history);
        return response.data;
    } catch (error) {
        throw error;
    }
}