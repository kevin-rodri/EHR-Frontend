/*
Name: Kevin Rodriugez
Date: 1/11/25
Remarks: AuthService that is responsible for making http requests to the backend. (For the users route)
*/
import { axiosInstance, axiosTokenInstance } from "./httpInterceptor";

const jwtLocalStorageKey = "JWT_TOKEN";
const roleLocalStorageKey = "ROLE";

export async function login(username, password) {
  try {
    const response = await axiosInstance().post(`users/signIn`, {
      username,
      password,
    });
    const { token, role } = response.data;
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
    localStorage.setItem(jwtLocalStorageKey, JSON.stringify({ token }));
    localStorage.setItem(roleLocalStorageKey, JSON.stringify({ role }));
    return response.data;
  } catch (error) {
    throw error;
  }
}

export function getUserRole() {
  const role = localStorage.getItem(roleLocalStorageKey);
  const parsed = JSON.parse(role);
  return parsed.role;
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
    const response = await axiosTokenInstance().delete(`users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getUserById(id) {
  try {
    const response = await axiosTokenInstance().get(`users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
