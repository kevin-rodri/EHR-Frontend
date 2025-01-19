/*
Name: Kevin Rodriugez
Date: 1/11/25
Remarks: AuthService that is responsible for making http requests to the backend. (For the users route)
*/
import { axiosInstance } from "./httpInterceptor";

const localStorageKey = "JWT_TOKEN";

export async function login(username, password) {
  try {
    const response = await axiosInstance().post(`users/signIn`, {
      username,
      password,
    });
    localStorage.setItem(localStorageKey, response.data.token); // We're going to change this afterwards..
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function registerUser(userData) {
  try {
    const response = await axiosInstance().post(`users/`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateUser(id, updatedUserInfo) {
  try {
    const response = await axiosInstance().put(`users/${id}`, updatedUserInfo);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteUser(id) {
  try {
    const response = await axiosInstance().delete(`users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}