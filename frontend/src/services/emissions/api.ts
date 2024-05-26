import axios from 'axios';
import { AssetResponse, Asset, Emission, EmissionDetail } from '../../types/emissions/types';

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
                    const detailsArray = emission[year] as EmissionDetail[];
                    const combinedDetails: EmissionDetail = detailsArray.reduce((combined, detail) => ({
                        ...combined,
                        Activity: detail.Activity !== null ? Number(detail.Activity) : combined.Activity,
                        ActivityUnits: detail.ActivityUnits || combined.ActivityUnits,
                        Capacity: detail.Capacity !== null ? Number(detail.Capacity) : combined.Capacity,
                        CapacityFactor: detail.CapacityFactor !== null ? Number(detail.CapacityFactor) : combined.CapacityFactor,
                        CapacityUnits: detail.CapacityUnits || combined.CapacityUnits,
                        EmissionsFactor: detail.EmissionsFactor !== null ? Number(detail.EmissionsFactor) : combined.EmissionsFactor,
                        EmissionsFactorUnits: detail.EmissionsFactorUnits || combined.EmissionsFactorUnits,
                        co2: detail.co2 !== undefined ? Number(detail.co2) : combined.co2,
                        ch4: detail.ch4 !== undefined ? Number(detail.ch4) : combined.ch4,
                        n2o: detail.n2o !== undefined ? Number(detail.n2o) : combined.n2o,
                        co2e_20yr: detail.co2e_20yr !== undefined ? Number(detail.co2e_20yr) : combined.co2e_20yr,
                        co2e_100yr: detail.co2e_100yr !== undefined ? Number(detail.co2e_100yr) : combined.co2e_100yr,
                    }), {} as EmissionDetail);
                    acc[year] = [combinedDetails];  // Use an array to match EmissionDetail[]
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
