import Router from 'koa-router';
import emissionsSourceRouter from './emissions/emissions_sources_route';

const mainRouter = new Router();

mainRouter.use('/api/emissions-source', emissionsSourceRouter.routes(), emissionsSourceRouter.allowedMethods());

export default mainRouter;
