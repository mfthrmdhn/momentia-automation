import { test, expect } from '@playwright/test';
import { assert } from 'superstruct';
import { UserEndpoints } from '../../src/api/endpoints/user.endpoint';
import { registerScenarios } from '../../src/scenario/register.scenario';

let userEndpoints: UserEndpoints;

test.describe('Register API Tests', () => {
    test.beforeEach(async ({ request }) => {
        userEndpoints = new UserEndpoints(request);
    });

    for (const scenario of registerScenarios) {
        test(scenario.description, async () => {
            const response = await userEndpoints.register(scenario.payload);
            const responseBody = await response.json();

            expect(response.status()).toBe(scenario.expectedStatus);
            assert(responseBody, scenario.expectedSchema);

            expect(responseBody.success).toBe(scenario.expectedSuccess);
            expect(responseBody.message).toBe(scenario.expectedMessage);
            if (scenario.expectedError) {
                expect(responseBody.error).toMatch(scenario.expectedError);
            }
        });
    }
});
