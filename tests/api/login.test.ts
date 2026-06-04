import { test, expect } from '@playwright/test';
import { assert } from 'superstruct';
import { UserEndpoints } from '../../src/api/endpoints/user.endpoint';
import { loginScenarios } from '../../src/scenario/login.scenario';

let userEndpoints: UserEndpoints;

test.describe('Login API Tests', () => {
    test.beforeEach(async ({ request }) => {
        userEndpoints = new UserEndpoints(request);
    });

    for (const scenario of loginScenarios) {
        test(scenario.description, async () => {
            const response = await userEndpoints.login(scenario.payload);
            const responseBody = await response.json();

            expect(response.status()).toBe(scenario.expectedStatus);
            assert(responseBody, scenario.expectedSchema);

            expect(responseBody.success).toBe(scenario.expectedSuccess);
            expect(responseBody.message).toBe(scenario.expectedMessage);
            if (scenario.expectedError) {
                expect(responseBody.error).toMatch(scenario.expectedError);
            }

            if (scenario.cleanup && responseBody.data?.token) {
                await userEndpoints.logout(responseBody.data.token);
            }
        });
    }
});
