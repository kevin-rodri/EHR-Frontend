/*
Name: Kevin Rodriugez
Date: 1/11/25
Remarks: AuthService that is responsible for making http requests to the backend. (For the users route)
*/
import axios from "axios";
import { serviceUrl, httpTokenInterceptor } from "./httpInterceptor";

const url = `${serviceUrl()}/users`;
const localStorageKey = "JWT_TOKEN";

// Logs in a user.
export function login(username, password) {
  try {
    const response = axios.post(`${url}/signIn`, { username, password });
    localStorage.setItem(localStorageKey, response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

export function registerUser(userData) {
  return axios.post(url, userData);
}

export function updateUser(id, updatedUserInfo) {
  return axios.put(`${url}/${id}`, updatedUserInfo);
}

export function deleteUser(id) {
  return axios.delete(`${url}/${id}`);
}
