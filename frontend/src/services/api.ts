import axios from 'axios';
import { Asset, AssetResponse } from '../types/types';

// Create an instance of Axios with default configurations
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Use the VITE_API_URL environment variable
    timeout: 10000, // Request timeout in milliseconds
});

// Utility function to remove empty fields from the query params
const removeEmptyFields = (params: any) => {
    return Object.keys(params)
        .filter((key) => params[key] !== '' && params[key] !== null && params[key] !== undefined)
        .reduce((obj, key) => {
            obj[key] = params[key];
            return obj;
        }, {} as any);
};

// API call to fetch assets data
export const fetchAssets = async (params: any): Promise<Asset[]> => {
    try {
        const filteredParams = removeEmptyFields(params);
        console.log('Request Params:', filteredParams);
        const response = await api.get<AssetResponse>('/api/emissions-source/assets', { params: filteredParams });
        return response.data.assets;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error fetching assets:', error);
            console.error('Error response:', error.response?.data);
            throw new Error(error.response?.data?.message || 'Failed to fetch assets');
        } else {
            console.error('Non-Axios error fetching assets:', error);
        }
        throw error;
    }
};

export default api;
