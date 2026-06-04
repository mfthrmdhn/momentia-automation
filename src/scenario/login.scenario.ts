import { loginSchema } from '../api/schema/auth.schema';
import { generalResponseSchema, errorResponseSchema } from '../api/schema/general.schema';
import { Struct } from 'superstruct';

const validEmail = 'mocks@gustr.com';
const validPassword = 'skidipapap';

export interface LoginScenario {
    description: string;
    payload: Record<string, string>;
    expectedStatus: number;
    expectedSchema: Struct<any, any>;
    expectedSuccess?: boolean;
    expectedMessage?: string;
    expectedError?: string | RegExp;
    cleanup?: boolean;
}

export const loginScenarios: LoginScenario[] = [
    {
        description: 'TC-LOG-001 - should login successfully with valid credentials',
        payload: { email: validEmail, password: validPassword },
        expectedStatus: 200,
        expectedSuccess: true,
        expectedSchema: loginSchema,
        expectedMessage: 'login successful',
        cleanup: true,
    },
    {
        description: 'TC-LOG-002 - should fail login with incorrect email',
        payload: { email: 'adasd@adss.com', password: validPassword },
        expectedStatus: 401,
        expectedSchema: generalResponseSchema,
        expectedSuccess: false,
        expectedMessage: 'invalid credentials',
    },
    {
        description: 'TC-LOG-003 - should fail login with incorrect password',
        payload: { email: validEmail, password: 'wrongpassword' },
        expectedStatus: 401,
        expectedSchema: generalResponseSchema,
        expectedSuccess: false,
        expectedMessage: 'invalid credentials',
    },
    {
        description: 'TC-LOG-004 - should fail login with empty email',
        payload: { email: '', password: validPassword },
        expectedStatus: 400,
        expectedSchema: errorResponseSchema,
        expectedSuccess: false,
        expectedMessage: 'validation error',
        expectedError: /Error:Field validation for 'Email'/,
    },
    {
        description: 'TC-LOG-005 - should fail login with empty password',
        payload: { email: validEmail, password: '' },
        expectedStatus: 400,
        expectedSchema: errorResponseSchema,
        expectedSuccess: false,
        expectedMessage: 'validation error',
        expectedError: /Error:Field validation for 'Password'/,
    },
    {
        description: 'TC-LOG-006 - should fail login with missing email',
        payload: { password: validPassword },
        expectedStatus: 400,
        expectedSchema: errorResponseSchema,
        expectedSuccess: false,
        expectedMessage: 'validation error',
        expectedError: /Error:Field validation for 'Email' failed/,
    },
    {
        description: 'TC-LOG-007 - should fail login with missing password',
        payload: { email: validEmail },
        expectedStatus: 400,
        expectedSchema: errorResponseSchema,
        expectedSuccess: false,
        expectedMessage: 'validation error',
        expectedError: /Error:Field validation for 'Password' failed/,
    },
    {
        description: 'TC-LOG-008 - should fail login with invalid email format',
        payload: { email: 'invalid-email', password: validPassword },
        expectedStatus: 400,
        expectedSchema: errorResponseSchema,
        expectedSuccess: false,
        expectedMessage: 'validation error',
        expectedError: /Error:Field validation for 'Email' failed/,
    }
];
