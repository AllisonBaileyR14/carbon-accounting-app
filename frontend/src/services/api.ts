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

const mergeEmissionDetails = (emissionDetails: EmissionDetail[]): EmissionDetail => {
    return emissionDetails.reduce((acc, detail) => {
        acc.Activity = detail.Activity !== null ? Number(detail.Activity) : acc.Activity;
        acc.Capacity = detail.Capacity !== null ? Number(detail.Capacity) : acc.Capacity;
        acc.CapacityFactor = detail.CapacityFactor !== null ? Number(detail.CapacityFactor) : acc.CapacityFactor;
        acc.EmissionsFactor = detail.EmissionsFactor !== null ? Number(detail.EmissionsFactor) : acc.EmissionsFactor;
        acc.co2 = detail.co2 !== undefined ? Number(detail.co2) : acc.co2;
        acc.ch4 = detail.ch4 !== undefined ? Number(detail.ch4) : acc.ch4;
        acc.n2o = detail.n2o !== undefined ? Number(detail.n2o) : acc.n2o;
        acc.co2e_20yr = detail.co2e_20yr !== undefined ? Number(detail.co2e_20yr) : acc.co2e_20yr;
        acc.co2e_100yr = detail.co2e_100yr !== undefined ? Number(detail.co2e_100yr) : acc.co2e_100yr;
        return acc;
    }, {} as EmissionDetail);
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
                    const mergedDetails = mergeEmissionDetails(emission[year] as EmissionDetail[]);
                    acc[year] = [mergedDetails];
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
