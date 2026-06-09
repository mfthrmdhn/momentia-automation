import { APIRequestContext } from '@playwright/test';

const prefix = 'v1';

export class PersonEndpoints {
    private PersonRequest: APIRequestContext;
    constructor(PersonRequest: APIRequestContext) {
        this.PersonRequest = PersonRequest;
    }

    async createPerson(data: object, token?: string) {
        return await this.PersonRequest.post(`${prefix}/persons`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            data: data
        });
    }

    async deletePerson(id: string, token?: string) {
        return await this.PersonRequest.delete(`${prefix}/persons/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
    }
}
