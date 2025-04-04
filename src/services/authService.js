/* eslint-disable react-hooks/rules-of-hooks */
/*
Name: Kevin Rodriugez
Date: 1/11/25
Remarks: AuthService that is responsible for making http requests to the backend. (For the users route)
*/

import { axiosInstance, axiosTokenInstance } from "./httpInterceptor";

const jwtLocalStorageKey = "JWT_TOKEN";
const roleLocalStorageKey = "ROLE";
const userLocalStorageKey = "USER_ID";
const sectionIdStorageKey = "SECTION_ID";

export async function login(username, password) {
  try {
    const response = await axiosInstance().post(`users/signIn`, {
      username,
      password,
    });
    const { id, token, role } = response.data;
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
    localStorage.setItem(userLocalStorageKey, JSON.stringify({ id }));
    localStorage.setItem(jwtLocalStorageKey, JSON.stringify({ token }));
    localStorage.setItem(roleLocalStorageKey, JSON.stringify({ role }));
    return response.data;
  } catch (error) {
    throw error;
  }
}
export function getUserID() {
  const id = localStorage.getItem(userLocalStorageKey);
  const parsed = JSON.parse(id);
  return parsed.id;
}

export function getUserRole() {
  const role = localStorage.getItem(roleLocalStorageKey);
  const parsed = JSON.parse(role);
  return parsed.role;
}

export const getSectionId = () => {
  const storedData = localStorage.getItem(sectionIdStorageKey);
  if (storedData == null) return null;
  try {
    if (storedData != null) {
      const parsedData = JSON.parse(storedData);
      return parsedData.sectionId;
    }
  } catch (error) {
    throw error;
  }
};

export async function getAllFacultyUsers() {
  try {
    const response = await axiosTokenInstance().get(`users/`);
    const users = response.data;
    const adminAndInstructors = users.filter(
      (user) => user.role === "ADMIN" || user.role === "INSTRUCTOR"
    );

    return adminAndInstructors;
  } catch (error) {
    console.error(error);
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

// added is user authenticated
export async function isAuthenticated(navigate) {
  try {
    const userID = getUserID();
    if (userID == null) {
      throw new Error("User ID not found");
    }
    const response = await axiosTokenInstance().get(
      `/users/${userID}/is-authenticated`
    );
    return response.status === 200;
  } catch (error) {
    if (error.response && [401, 403].includes(error.response.status)) {
      localStorage.clear();
      navigate("/");
    }
    return false;
  }
}

export function logout() {
  localStorage.clear();
}
