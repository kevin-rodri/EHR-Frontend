/*
Name: Kevin Rodriugez
Date: 1/11/25
Remarks: AuthService that is responsible for making http requests to the backend. (For the users route)
*/
import { useNavigate } from "react-router-dom";
import { axiosInstance, axiosTokenInstance } from "./httpInterceptor";

const jwtLocalStorageKey = "JWT_TOKEN";
const roleLocalStorageKey = "ROLE";
const userLocalStorageKey = "USER_ID";

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
  const storedData = localStorage.getItem("SECTION_ID");
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
    const response = await axiosTokenInstance().get(`/users/${getUserID()}/is-authenticated`);

    return response.status === 200;
  } catch (error) {
    localStorage.removeItem(userLocalStorageKey);
    localStorage.removeItem(jwtLocalStorageKey);
    localStorage.removeItem(roleLocalStorageKey);
    console.error(error);
    
    // Redirect to login page
    if (navigate) {
      navigate("/");
    }
    
    return false;
  }
}

