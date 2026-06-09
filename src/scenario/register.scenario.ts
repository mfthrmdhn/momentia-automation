import { registerSchema } from '../api/schema/auth.schema';
import { errorResponseSchema } from '../api/schema/general.schema';
import { Struct } from 'superstruct';

const ts = Date.now();
const uniqueEmail = `test.register+${ts}@cuvox.de`;
const uniqueMsisdn = `0812${ts.toString().slice(-7)}`;
const uniqueUsername = `reguser${ts.toString().slice(-6)}`;
const validPassword = 'testpassword';

export interface RegisterScenario {
    description: string;
    payload: Record<string, string>;
    expectedStatus: number;
    expectedSchema: Struct<any, any>;
    expectedSuccess?: boolean;
    expectedMessage?: string;
    expectedError?: string | RegExp;
}

export const registerScenarios: RegisterScenario[] = [
    {
        description: 'TC-REG-001 - should register successfully with valid data',
        payload: { username: uniqueUsername, email: uniqueEmail, password: validPassword, msisdn: uniqueMsisdn },
        expectedStatus: 200,
        expectedSchema: registerSchema,
        expectedSuccess: true,
        expectedMessage: 'user registered successfully',
    },
    {
        description: 'TC-REG-002 - should fail registration with duplicate email',
        payload: { username: `${uniqueUsername}b`, email: 'mocks@cuvox.de', password: validPassword, msisdn: `0812${(ts + 1).toString().slice(-7)}` },
        expectedStatus: 400,
        expectedSchema: errorResponseSchema,
        expectedSuccess: false,
        expectedMessage: 'validation error',
        expectedError: 'email already registered',
    },
    {
        description: 'TC-REG-003 - should fail registration with empty email',
        payload: { username: uniqueUsername, email: '', password: validPassword, msisdn: uniqueMsisdn },
        expectedStatus: 400,
        expectedSchema: errorResponseSchema,
        expectedSuccess: false,
        expectedMessage: 'validation error',
        expectedError: /Error:Field validation for 'Email'/,
    },
    {
        description: 'TC-REG-004 - should fail registration with empty password',
        payload: { username: uniqueUsername, email: uniqueEmail, password: '', msisdn: uniqueMsisdn },
        expectedStatus: 400,
        expectedSchema: errorResponseSchema,
        expectedSuccess: false,
        expectedMessage: 'validation error',
        expectedError: /Error:Field validation for 'Password'/,
    },
    {
        description: 'TC-REG-005 - should fail registration with missing email',
        payload: { username: uniqueUsername, password: validPassword, msisdn: uniqueMsisdn },
        expectedStatus: 400,
        expectedSchema: errorResponseSchema,
        expectedSuccess: false,
        expectedMessage: 'validation error',
        expectedError: /Error:Field validation for 'Email' failed/,
    },
    {
        description: 'TC-REG-006 - should fail registration with missing password',
        payload: { username: uniqueUsername, email: uniqueEmail, msisdn: uniqueMsisdn },
        expectedStatus: 400,
        expectedSchema: errorResponseSchema,
        expectedSuccess: false,
        expectedMessage: 'validation error',
        expectedError: /Error:Field validation for 'Password' failed/,
    },
    {
        description: 'TC-REG-007 - should fail registration with invalid email format',
        payload: { username: uniqueUsername, email: 'invalid-email', password: validPassword, msisdn: uniqueMsisdn },
        expectedStatus: 400,
        expectedSchema: errorResponseSchema,
        expectedSuccess: false,
        expectedMessage: 'validation error',
        expectedError: /Error:Field validation for 'Email' failed/,
    },
    {
        description: 'TC-REG-008 - should fail registration with missing msisdn',
        payload: { username: uniqueUsername, email: uniqueEmail, password: validPassword },
        expectedStatus: 400,
        expectedSchema: errorResponseSchema,
        expectedSuccess: false,
        expectedMessage: 'validation error',
        expectedError: /Error:Field validation for 'Msisdn' failed/,
    },
    {
        description: 'TC-REG-009 - should fail registration with empty username',
        payload: { username: '', email: uniqueEmail, password: validPassword, msisdn: uniqueMsisdn },
        expectedStatus: 400,
        expectedSchema: errorResponseSchema,
        expectedSuccess: false,
        expectedMessage: 'validation error',
        expectedError: /Error:Field validation for 'Username' failed/,
    },
    {
        description: 'TC-REG-010 - should fail registration with missing username',
        payload: { email: uniqueEmail, password: validPassword, msisdn: uniqueMsisdn },
        expectedStatus: 400,
        expectedSchema: errorResponseSchema,
        expectedSuccess: false,
        expectedMessage: 'validation error',
        expectedError: /Error:Field validation for 'Username' failed/,
    },
    {
        description: 'TC-REG-011 - should fail registration with duplicate msisdn',
        payload: { username: `${uniqueUsername}d`, email: `d${uniqueEmail}`, password: validPassword, msisdn: '08199999999' },
        expectedStatus: 400,
        expectedSchema: errorResponseSchema,
        expectedSuccess: false,
        expectedMessage: 'validation error',
        expectedError: 'msisdn already registered',
    },
];
