import Router from '@koa/router';

const router = new Router();

router.get('/api/hello', async (ctx) => {
    try {
        ctx.body = { message: 'Hello, world!' };
    } catch (error) {
        console.error('Error in /api/hello route:', error);
        ctx.status = 500;
        ctx.body = { message: 'Internal Server Error' };
    }
});

export default router;
