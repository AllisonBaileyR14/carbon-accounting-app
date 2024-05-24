import axios from 'axios';

// Create an instance of Axios with default configurations
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + '/api', // Use the VITE_API_URL environment variable
    timeout: 10000, // Request timeout in milliseconds
});

// Example API call to fetch a message from the backend
export const fetchMessage = async (): Promise<string> => {
    try {
        console.log('Making API call to /hello');
        const response = await api.get('/hello');
        console.log('API response:', response.data);
        return response.data.message;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error fetching message:', error);
            console.error('Error response:', error.response);
            throw new Error(error.response?.data?.message || 'Failed to fetch message');
        } else {
            console.error('Non-Axios error fetching message:', error);
        }
        throw error;
    }
};

// Other API calls can be added here
export default api;
