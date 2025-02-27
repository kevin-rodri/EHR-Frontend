/* 
Name: Kevin Rodriguez 
Date: 2/21/25
Remarks: The waldo service that will be used to make calls to the backend. 
*/
import { axiosTokenInstance } from "./httpInterceptor";

export async function getPatientWaldoInfo(sectionPatientId) {
  try {
    const response = await axiosTokenInstance().get(
      `patients/${sectionPatientId}/waldo-diagram`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function addPatientWaldoInfo(sectionPatientId, data) {
  try {
    const response = await axiosTokenInstance().post(
      `patients/${sectionPatientId}/waldo-diagram`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updatePatientWaldoInfo(sectionPatientId, id, data) {
  try {
    const response = await axiosTokenInstance().put(
      `patients/${sectionPatientId}/waldo-diagram/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deletePatientWaldoInfo(sectionPatientId, id) {
  try {
    const response = await axiosTokenInstance().delete(
      `patients/${sectionPatientId}/waldo-diagram/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
