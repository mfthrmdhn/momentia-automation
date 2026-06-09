import { generalResponseSchema, tokenErrorSchema } from '../api/schema/general.schema';
import { Struct } from 'superstruct';

export interface LogoutScenario {
    description: string;
    token?: string;
    requiresValidToken?: boolean;
    expectedStatus: number;
    expectedSchema: Struct<any, any>;
    expectedSuccess?: boolean;
    expectedMessage?: string;
    expectedError?: string;
}

export const logoutScenarios: LogoutScenario[] = [
    {
        description: 'TC-LOUT-001 - should logout successfully with valid token',
        requiresValidToken: true,
        expectedStatus: 200,
        expectedSchema: generalResponseSchema,
        expectedSuccess: true,
        expectedMessage: 'logout successful',
    },
    {
        description: 'TC-LOUT-002 - should fail logout with invalid token',
        token: 'invalid_token_string',
        expectedStatus: 401,
        expectedSchema: tokenErrorSchema,
        expectedSuccess: undefined,
        expectedMessage: undefined,
        expectedError: 'Invalid or expired token',
    },
    {
        description: 'TC-LOUT-003 - should fail logout with empty token',
        token: '',
        expectedStatus: 401,
        expectedSchema: tokenErrorSchema,
        expectedSuccess: undefined,
        expectedMessage: undefined,
        expectedError: 'Invalid or expired token',
    },
];