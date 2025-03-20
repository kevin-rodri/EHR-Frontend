import { axiosTokenInstance } from "./httpInterceptor";

export async function getMusculoskeletalInfo(section_patient_id) {
  try {
    const response = await axiosTokenInstance().get(
      `/assessments/${section_patient_id}/musculoskeletal`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getMusculoskeletalInfoAdmin(section_patient_id) {
  try {
    const response = await axiosTokenInstance().get(
      `/assessments/${section_patient_id}/musculoskeletal/students`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function addMusculoskeletalInfo(
  section_patient_id,
  musculoskeletal
) {
  try {
    const response = await axiosTokenInstance().post(
      `/assessments/${section_patient_id}/musculoskeletal`,
      musculoskeletal
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateMusculoskeletalInfo(
  section_patient_id,
  id,
  musculoskeletal
) {
  try {
    const response = await axiosTokenInstance().put(
      `/assessments/${section_patient_id}/musculoskeletal/${id}`,
      musculoskeletal
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteMusculoskeletalInfo(section_patient_id, id) {
  try {
    const response = await axiosTokenInstance().delete(
      `/assessments/${section_patient_id}/musculoskeletal/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
