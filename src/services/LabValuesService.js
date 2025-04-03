/*
Name: Charlize Aponte
Date: 3/28/25 
Remark: Lab Value service that's responsible to make API calls to our back end
*/

import { axiosTokenInstance } from "./httpInterceptor";

//Get lab values for a patient (created by faculty)
export async function getPatientLabValues(sectionPatientId) {
    try{
     const response = await axiosTokenInstance().get(`patients/${sectionPatientId}/lab-values`);
     return response.data;
    } catch (error){
        throw error;
    }
}

//Add a new lab value (faculty oriented)
export async function addPatientLabValues(sectionPatientId,data){
    try{
        const response = await axiosTokenInstance().post(`patients/${sectionPatientId}/lab-values`,data);
        return response.data;
    }  catch (error) {
        throw error; 
    }
}
//Update a lab value (for students)
export async function updatePatientLabValue(sectionPatientId, id, data) {
    try {
      const response = await axiosTokenInstance().put(`patients/${sectionPatientId}/lab-values/${id}`,data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

//Delete a lab value (for faculty)
export async function deletePatientLabValue(sectionPatientId, id) {
    try {
      const response = await axiosTokenInstance().delete(`patients/${sectionPatientId}/lab-values/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  