import { object, string } from 'superstruct';
import { generalFields } from './general.schema';

export const loginSchema = object({
    ...generalFields,
    data: object({
        token: string()
    }),
});