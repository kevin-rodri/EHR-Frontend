/*
Name: Kevin Rodriguez
Date: 1/21/25
Remark: Section service that's responsible to make API calls to our back end
*/
import { axiosInstance } from "./httpInterceptor";


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

