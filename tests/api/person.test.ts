import { test, expect } from '../fixtures/auth.fixture';
import { assert } from 'superstruct';
import { PersonEndpoints } from '../../src/api/endpoints/person.endpoint';
import { createPersonScenarios } from '../../src/scenario/person.scenario';

test.describe('Person API Tests', () => {
    for (const scenario of createPersonScenarios) {
        test(scenario.description, async ({ request, workerToken }) => {
            const personEndpoints = new PersonEndpoints(request);
            const token = scenario.requiresValidToken ? workerToken : scenario.token;

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

            if (responseBody.data?.id) {
                await personEndpoints.deletePerson(responseBody.data.id, token);
            }
        });
    }
});