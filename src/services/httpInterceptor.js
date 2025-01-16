/* 
Name: Kevin Rodriguez
Date: 1/11/25 
Remark: The httpInterceptor is so that we can ntercept requests and responses sent or received by a browser
To learn more what an interceptor is, I highly suggest taking the time and reading this: 
https://medium.com/@jscodelover/understanding-request-and-response-interceptors-in-javascript-e2fe20dbabbf#:~:text=What%20are%20Request%20and%20Response,from%20multiple%20APIs%20or%20services
Some code was borrowed from here: https://javascript.plainenglish.io/understanding-interceptors-in-react-js-bb0a86cbc5a2
*/
import axios from "axios";

// creates interceptor that will be used as part of http requests
export const httpTokenInterceptor = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token != null) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

// used for handling responses from an http call
export const httpResponseInterceptor = () => {
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

// to be used to in each of the services
export const serviceUrl = () => {
  return `ehr-application.vercel.app`;
};
