import { boolean, object, string } from 'superstruct';

export const generalFields = {
    success: boolean(),
    message: string(),
};

export const generalResponseSchema = object(generalFields);

export const errorResponseSchema = object({
    ...generalFields,
    error: string(),
});

export const tokenErrorSchema = object({
    error: string(),
});