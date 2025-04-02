import { axiosTokenInstance } from "./httpInterceptor";

export async function getPatientPainScaleResult(sectionPatientId) {
  try {
    const response = await axiosTokenInstance().get(
      `/patients/${sectionPatientId}/pain-scale`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getPatientPainScaleResultById(
  sectionPatientId,
  scaleResultId
) {
  try {
    const response = await axiosTokenInstance().get(
      `/patients/${sectionPatientId}/pain-scale/${scaleResultId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
export async function updatePatientPainScaleResult(
  sectionPatientId,
  scaleResultId,
  updatedScaleData
) {
  try {
    const response = await axiosTokenInstance().put(
      `/patients/${sectionPatientId}/pain-scale/${scaleResultId}`,
      updatedScaleData
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
export async function deletePatientPainScaleResult(
  sectionPatientId,
  scaleResultId
) {
  try {
    const response = await axiosTokenInstance().delete(
      `/patients/${sectionPatientId}/pain-scale/${scaleResultId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
export async function addPatientPainScaleResult(sectionPatientId, scaleData) {
  try {
    const response = await axiosTokenInstance().post(
      `/patients/${sectionPatientId}/pain-scale`,
      scaleData
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
