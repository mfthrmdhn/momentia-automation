import { faker } from '@faker-js/faker';
import { Struct } from 'superstruct';
import { createPersonSchema } from '../api/schema/person.schema';
import { errorResponseSchema, tokenErrorSchema } from '../api/schema/general.schema';

const fakeName = faker.person.fullName();
const fakeRelationship = faker.helpers.arrayElement(['Partner', 'Friend', 'Family', 'Colleague']);

export interface PersonScenario {
    description: string;
    payload: Record<string, string | boolean>;
    token?: string;
    requiresValidToken?: boolean;
    expectedStatus: number;
    expectedSchema: Struct<any, any>;
    expectedSuccess?: boolean;
    expectedMessage?: string;
    expectedError?: string | RegExp;
}

export const createPersonScenarios: PersonScenario[] = [
    {
        description: 'TC-PER-001 - should create a person successfully with valid payload and token',
        payload: { name: fakeName, relationship: fakeRelationship, is_pinned: false },
        requiresValidToken: true,
        expectedStatus: 200,
        expectedSchema: createPersonSchema,
        expectedSuccess: true,
        expectedMessage: 'person created successfully',
    },
    {
        description: 'TC-PER-002 - should fail to create a person with no Authorization header',
        payload: { name: fakeName, relationship: fakeRelationship, is_pinned: false },
        // token is intentionally omitted — no Authorization header is sent
        expectedStatus: 401,
        expectedSchema: tokenErrorSchema,
        expectedError: 'Authorization header is required',
    },
    {
        description: 'TC-PER-003 - should fail to create a person with an invalid token',
        payload: { name: fakeName, relationship: fakeRelationship, is_pinned: false },
        token: 'invalid_token_string',
        expectedStatus: 401,
        expectedSchema: tokenErrorSchema,
        expectedError: 'Invalid or expired token',
    },
    {
        description: 'TC-PER-004 - should fail to create a person with missing name',
        payload: { relationship: fakeRelationship, is_pinned: false },
        requiresValidToken: true,
        expectedStatus: 400,
        expectedSchema: errorResponseSchema,
        expectedSuccess: false,
        expectedMessage: 'validation error',
        expectedError: /Error:Field validation for 'Name' failed on the 'required' tag/,
    },
    {
        description: 'TC-PER-005 - should fail to create a person with empty name',
        payload: { name: '', relationship: fakeRelationship, is_pinned: false },
        requiresValidToken: true,
        expectedStatus: 400,
        expectedSchema: errorResponseSchema,
        expectedSuccess: false,
        expectedMessage: 'validation error',
        expectedError: /Error:Field validation for 'Name' failed on the 'required' tag/,
    },
    {
        description: 'TC-PER-006 - should fail to create a person with missing relationship',
        payload: { name: fakeName, is_pinned: false },
        requiresValidToken: true,
        expectedStatus: 400,
        expectedSchema: errorResponseSchema,
        expectedSuccess: false,
        expectedMessage: 'validation error',
        expectedError: /Error:Field validation for 'Relationship' failed on the 'required' tag/,
    },
    {
        description: 'TC-PER-007 - should fail to create a person with empty relationship',
        payload: { name: fakeName, relationship: '', is_pinned: false },
        requiresValidToken: true,
        expectedStatus: 400,
        expectedSchema: errorResponseSchema,
        expectedSuccess: false,
        expectedMessage: 'validation error',
        expectedError: /Error:Field validation for 'Relationship' failed on the 'required' tag/,
    },
];
