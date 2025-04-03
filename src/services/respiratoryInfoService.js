// gabby pierce
import { axiosTokenInstance } from "./httpInterceptor";

export async function getRespiratoryInfo(section_patient_id) {
  try {
    const response = await axiosTokenInstance().get(
      `/assessments/${section_patient_id}/respiratory`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getRespiratoryInfoAdmin(section_patient_id) {
  try {
    const response = await axiosTokenInstance().get(
      `/assessments/${section_patient_id}/respiratory/students`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function addRespiratoryInfo(section_patient_id, respiratory) {
  try {
    const response = await axiosTokenInstance().post(
      `/assessments/${section_patient_id}/respiratory`,
      respiratory
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateRespiratoryInfo(section_patient_id, id, respiratory) {
  try {
    const response = await axiosTokenInstance().put(
      `/assessments/${section_patient_id}/respiratory/${id}`,
      respiratory
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteRespiratoryInfo(section_patient_id, id) {
  try {
    const response = await axiosTokenInstance().delete(
      `/assessments/${section_patient_id}/respiratory/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
