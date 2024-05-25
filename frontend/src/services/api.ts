import axios from 'axios';
import { AssetResponse, Asset, Emission, EmissionDetail } from '../types/types';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
});

const cleanParams = (params: any) => {
    const cleanedParams: any = {};
    for (const key in params) {
        if (params[key] !== null && params[key] !== '' && params[key] !== undefined) {
            cleanedParams[key] = params[key];
        }
    }
    return cleanedParams;
};

export const fetchAssets = async (params: any): Promise<Asset[]> => {
    try {
        const cleanedParams = cleanParams(params);
        const response = await api.get<AssetResponse>('/api/emissions-source/assets', {
            params: cleanedParams,
        });
        return response.data.assets.map(asset => ({
            ...asset,
            Emissions: asset.Emissions?.map(emission => ({
                ...emission,
                ...Object.keys(emission).reduce((acc, year) => {
                    acc[year] = (emission[year] as EmissionDetail[]).map(detail => ({
                        ...detail,
                        Activity: detail.Activity !== null ? Number(detail.Activity) : null,
                        Capacity: detail.Capacity !== null ? Number(detail.Capacity) : null,
                        CapacityFactor: detail.CapacityFactor !== null ? Number(detail.CapacityFactor) : null,
                        EmissionsFactor: detail.EmissionsFactor !== null ? Number(detail.EmissionsFactor) : null,
                        co2: detail.co2 !== undefined ? Number(detail.co2) : undefined,
                        ch4: detail.ch4 !== undefined ? Number(detail.ch4) : undefined,
                        n2o: detail.n2o !== undefined ? Number(detail.n2o) : undefined,
                        co2e_20yr: detail.co2e_20yr !== undefined ? Number(detail.co2e_20yr) : undefined,
                        co2e_100yr: detail.co2e_100yr !== undefined ? Number(detail.co2e_100yr) : undefined,
                    }));
                    return acc;
                }, {} as Emission),
            })) ?? [],
        }));
    } catch (error) {
        console.error('Axios error fetching assets:', error);
        console.error('Error response:', (error as any).response?.data);
        throw error;
    }
};

export default api;
