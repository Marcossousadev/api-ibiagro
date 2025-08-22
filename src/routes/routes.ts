import {z} from 'zod';
import {FastifyTypeInstance} from '../types/type-fastify';

export async function routes(app:FastifyTypeInstance){
    app.get('/users', async (req, rep) => {
        return 'Hello wordld'
    });
}