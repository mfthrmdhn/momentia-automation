import { number, object, string } from 'superstruct';
import { generalFields } from './general.schema';

export const loginSchema = object({
    ...generalFields,
    data: object({
        token: string()
    }),
});

export const registerSchema = object({
    ...generalFields,
    data: object({
        id: number(),
        username: string(),
        email: string(),
        msisdn: string(),
        created_at: string(),
        updated_at: string(),
    }),
});