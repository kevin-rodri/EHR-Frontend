/*
Name: Kevin Rodriguez
Date: 1/21/25
Remark: Section service that's responsible to make API calls to our back end
*/
import { axiosInstance } from "./httpInterceptor";
import { getUserID } from "./authService";

export async function addUserToSectionRoster(section_id, rosterData) {
  try {
    const response = await axiosInstance().post(
      `/roster/${section_id}/section-roster`,
      rosterData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getUserSectionRosterByID() {
  try {
    const userId = getUserID();

    const response = await axiosInstance().get(
      `/roster/section-roster/${userId}`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}
