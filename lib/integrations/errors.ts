export class IntegrationNotConfiguredError extends Error {
    constructor(public readonly integration: string) {
        super(`${integration} integration is not configured`);
        this.name = "IntegrationNotConfiguredError";
    }
}

export class IntegrationRequestError extends Error {
    constructor(public readonly integration: string, message: string, public readonly status?: number) {
        super(message);
        this.name = "IntegrationRequestError";
    }
}
