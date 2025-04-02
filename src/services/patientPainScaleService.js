import { axiosInstance } from "./httpInterceptor";

export async function getScales() {
    try {
        const response = await axiosInstance().get(`/scales/`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function getScaleById(id) {
    try {
        const response = await axiosInstance().get(`/scales/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
export async function addScale(scaleData) {
    try {
        const response = await axiosInstance().post(`/scales/`, scaleData);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
export async function updateScale(id, updatedScaleInfo) {
    try {
        const response = await axiosInstance().put(`/scales/${id}`, updatedScaleInfo);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
export async function deleteScale(id) {
    try {
        const response = await axiosInstance().delete(`/scales/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
