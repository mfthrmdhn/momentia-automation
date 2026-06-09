import { test, expect } from '@playwright/test';
import { assert } from 'superstruct';
import { UserEndpoints } from '../../src/api/endpoints/user.endpoint';
import { logoutScenarios } from '../../src/scenario/logout.scenario';

const validEmail = 'mocks@cuvox.de';
const validPassword = 'testpassword';

let userEndpoints: UserEndpoints;

test.describe('Logout API Tests', () => {
    test.beforeEach(async ({ request }) => {
        userEndpoints = new UserEndpoints(request);
    });

    for (const scenario of logoutScenarios) {
        test(scenario.description, async () => {
            let token = scenario.token ?? '';

            if (scenario.requiresValidToken) {
                const loginResponse = await userEndpoints.login({ email: validEmail, password: validPassword });
                const loginBody = await loginResponse.json();
                token = loginBody.data.token;
            }

            const response = await userEndpoints.logout(token);
            const responseBody = await response.json();

            expect(response.status()).toBe(scenario.expectedStatus);
            assert(responseBody, scenario.expectedSchema);
            expect(responseBody.success).toBe(scenario.expectedSuccess);
            expect(responseBody.message).toBe(scenario.expectedMessage);
            expect(responseBody.error).toBe(scenario.expectedError);
        });
    }
});