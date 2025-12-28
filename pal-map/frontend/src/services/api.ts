import axios, { type AxiosInstance } from "axios";
import { useToast } from "vue-toastification";

const baseURL =
    window.location.hostname === "localhost"
        ? "http://localhost:3000/api"
        : `http://${window.location.hostname}:3000/api`;
const api: AxiosInstance = axios.create({
    baseURL,
    timeout: 5000,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const toast = useToast();

        // Handle known HTTP error statuses
        if (error.response) {
            const status = error.response.status;
            switch (status) {
                case 400:
                    toast.error("Bad request. Please check your input.");
                    break;
                case 401:
                    toast.error("Unauthorized. Please log in again.");
                    break;
                case 403:
                    toast.error("You don’t have permission to perform this action.");
                    break;
                case 404:
                    toast.error("Resource not found.");
                    break;
                case 500:
                    toast.error("Server error. Please try again later.");
                    break;
                default:
                    toast.error(`Unexpected error (${status}).`);
            }
        } else if (error.request) {
            // No response from server (network or timeout)
            toast.error("Network error or server not responding.");
        } else {
            // Error before request was sent
            toast.error("Unexpected error occurred.");
        }

        // Always reject so local `try/catch` can still handle it
        return Promise.reject(error);
    }
);

export interface GenernicApiResponse<T> {
    success: boolean;
    data: T;
}

export default api;
