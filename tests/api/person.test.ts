import { test, expect } from '@playwright/test';
import { assert } from 'superstruct';
import { UserEndpoints } from '../../src/api/endpoints/user.endpoint';
import { PersonEndpoints } from '../../src/api/endpoints/person.endpoint';
import { createPersonScenarios } from '../../src/scenario/person.scenario';

const validEmail = 'mocks@cuvox.de';
const validPassword = 'testpassword';

let personEndpoints: PersonEndpoints;

test.describe('Person API Tests', () => {
    // Serial mode is required because the backend permits only one active session per user.
    // Parallel login attempts from multiple workers would cause race-condition failures.
    test.describe.configure({ mode: 'serial' });

    test.beforeAll(async ({ request }) => {
        // Ensure no active session is left from a previous interrupted run.
        // The backend permits only one concurrent session per user; logging in and
        // immediately logging out clears any stuck session before the suite begins.
        const endpoints = new UserEndpoints(request);
        const loginResponse = await endpoints.login({ email: validEmail, password: validPassword });
        const loginBody = await loginResponse.json();
        if (loginBody.data?.token) {
            await endpoints.logout(loginBody.data.token);
        }
    });

    test.beforeEach(async ({ request }) => {
        personEndpoints = new PersonEndpoints(request);
    });

    for (const scenario of createPersonScenarios) {
        test(scenario.description, async ({ request }) => {
            let token: string | undefined = scenario.token;
            const userEndpoints = new UserEndpoints(request);

            if (scenario.requiresValidToken) {
                const loginResponse = await userEndpoints.login({ email: validEmail, password: validPassword });
                const loginBody = await loginResponse.json();
                token = loginBody.data.token;
            }

            const response = await personEndpoints.createPerson(scenario.payload, token);
            const responseBody = await response.json();

            expect(response.status()).toBe(scenario.expectedStatus);
            assert(responseBody, scenario.expectedSchema);

            if (scenario.expectedSuccess !== undefined) {
                expect(responseBody.success).toBe(scenario.expectedSuccess);
            }
            if (scenario.expectedMessage !== undefined) {
                expect(responseBody.message).toBe(scenario.expectedMessage);
            }
            if (scenario.expectedError !== undefined) {
                expect(responseBody.error).toMatch(scenario.expectedError);
            }

            // Release the session after every scenario that acquired a valid token so that
            // subsequent tests can log in. The backend permits only one active session per user.
            // NOTE: DELETE /persons is not yet exposed by the backend, so created persons
            // from TC-PER-001 accumulate in the database. Add person cleanup here once a
            // delete endpoint is available.
            if (scenario.requiresValidToken && token) {
                await userEndpoints.logout(token);
            }
        });
    }
});
