/*
Name: Charlize Aponte
Date: 1/31/25 
Remark: Section service that's responsible to make API calls to our back end
*/
import { axiosInstance, axiosTokenInstance } from "./httpInterceptor";



export async function getAllSections() {
    try {
      const response = await axiosInstance().get(`sections`);
      return response.data; 
    } catch (error) {
      throw error;
    }
  }
  
// TO-DO: add the remaining API endpoints.. 

// THIS METHOD GETS ALL THE SECTION BY IDS FROM THE API CALLS 
export async function getSectionsById(id) {
  try {
    const response = await axiosTokenInstance().get(`sections/${id}`);
    return response.data; 
  } catch (error) {
    throw error;
  }
}
// THIS METHOD UPDATES THE SECTION  FROM THE API CALLS 
export async function updateSection(id) { 
  try {
    const response = await axiosTokenInstance().put( `sections/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// THIS METHOD CREATES A SECTION FROM THE API CALLS 
export async function createSection() { 
  try {
    const response = await axiosTokenInstance().post(`sections`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// THIS METHOD DELETES A SECTION FROM THE API CALLS
export async function deleteSection(id) { 
  try {
    const response = await axiosTokenInstance().delete(`sections/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}