/*
Name: Charlize Aponte
Date: 2/25/25 
Remark: Section service that's responsible to make API calls to our back end
*/

import { axiosTokenInstance } from "./httpInterceptor";

export async function getPatientIVLine(sectionPatientId) {
    try{
        const response = await axiosTokenInstance().get(`patients/${sectionPatientId}/iv-lines`);
        return response.data;
    } catch (error) {
        throw error;
      }
    }
    export async function addPatientIVLine(sectionPatientId, data) {
        try {
          const response = await axiosTokenInstance().post(
            `patients/${sectionPatientId}/iv-lines`,
            data
          );
          return response.data;
        } catch (error) {
          throw error;
        }
      }
      
      export async function updatePatientIVLine(sectionPatientId, id, data) {
        try {
          const response = await axiosTokenInstance().put(
            `patients/${sectionPatientId}/iv-lines/${id}`,
            data
          );
          return response.data;
        } catch (error) {
          throw error;
        }
      }
      
      export async function deletePatientIVLine(sectionPatientId, id) {
        try {
          const response = await axiosTokenInstance().delete(
            `patients/${sectionPatientId}/iv-lines/${id}`
          );
          return response.data;
        } catch (error) {
          throw error;
        }
      }