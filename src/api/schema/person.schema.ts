import { boolean, number, object, string } from 'superstruct';
import { generalFields } from './general.schema';

export const createPersonSchema = object({
    ...generalFields,
    data: object({
        id: string(),
        creator_user_id: number(),
        name: string(),
        relationship: string(),
        is_pinned: boolean(),
        created_at: string(),
        updated_at: string(),
    }),
});
