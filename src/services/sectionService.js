/*
Name: Kevin Rodriguez
Date: 1/19/25 
Remark: Section service that's responsible to make API calls to our back end
*/
import { axiosInstance } from "./httpInterceptor";


export async function getAllSections() {
    try {
      const response = await axiosInstance().get(`sections`);
      return response.data; 
    } catch (error) {
      throw error;
    }
  }
  
// TO-DO: add the remaining API endpoints.. 