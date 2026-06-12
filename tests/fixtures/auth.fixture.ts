import { test as base } from '@playwright/test';
import { UserEndpoints } from '../../src/api/endpoints/user.endpoint';
import { workerUsers } from '../../src/data/user.data';

export const test = base.extend<{}, { workerToken: string }>({
    workerToken: [async ({ playwright }, use, workerInfo) => {
        const context = await playwright.request.newContext({
            baseURL: process.env.API_BASE_URL,
        });
        const user = workerUsers[workerInfo.parallelIndex];
        const endpoints = new UserEndpoints(context);

        // Clear any stuck session left by a previous interrupted run.
        const clearRes = await endpoints.login(user);
        const clearBody = await clearRes.json();
        if (clearBody.data?.token) {
            await endpoints.logout(clearBody.data.token);
        }

        const loginRes = await endpoints.login(user);
        const loginBody = await loginRes.json();
        if (!loginBody.data?.token) {
            throw new Error(
                `Parallel worker ${workerInfo.parallelIndex} failed to login as ${user.email}. ` +
                `Ensure workerUsers.length (${workerUsers.length}) >= total worker count.`
            );
        }
        const token: string = loginBody.data.token;

        await use(token);

        await endpoints.logout(token);
        await context.dispose();
    }, { scope: 'worker' }],
});

export { expect } from '@playwright/test';
