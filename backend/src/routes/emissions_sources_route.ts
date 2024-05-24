import Router from 'koa-router';
import axios from 'axios';
import { AssetQueryParams, AssetResponse } from '../models/emissions_sources_model';

const emissionsSourceRouter = new Router();

emissionsSourceRouter.get('/assets', async (ctx) => {
    const queryParams: AssetQueryParams = {
        limit: parseInt(ctx.query.limit as string, 10) || 100,
        year: parseInt(ctx.query.year as string, 10),
        offset: parseInt(ctx.query.offset as string, 10) || 0,
        countries: ctx.query.countries as string,
        sectors: ctx.query.sectors as string,
        subsectors: ctx.query.subsectors as string,
        continents: ctx.query.continents as string,
        groups: ctx.query.groups as string,
        adminId: parseInt(ctx.query.adminId as string, 10),
    };

    console.log('Received Query Params:', queryParams); // Log incoming query params

    try {
        const response = await axios.get<AssetResponse>('https://api.climatetrace.org/v4/assets', {
            params: queryParams,
        });
        console.log('API Response:', response.data); // Log the API response
        ctx.body = response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            ctx.status = error.response?.status || 500;
            ctx.body = { error: error.message };
        } else {
            ctx.status = 500;
            ctx.body = { error: 'An unexpected error occurred' };
        }
    }
});

export default emissionsSourceRouter;
