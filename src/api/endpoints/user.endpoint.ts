import {APIRequestContext} from '@playwright/test';

const prefix = 'v1';

export class UserEndpoints {
    private UserRequest: APIRequestContext;
    constructor(UserRequest: APIRequestContext) {
        this.UserRequest = UserRequest;
    }

    async register(data: object) {
        return await this.UserRequest.post(`${prefix}/auth/register`, {
            data: data
        });
    }

    async login(data: object) {
        return await this.UserRequest.post(`${prefix}/auth/login`, {
            data: data
        });
    }

    async logout( token: string) {
        return await this.UserRequest.post(`${prefix}/logout`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}
