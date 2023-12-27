import fastify, { FastifyInstance, LightMyRequestResponse } from 'fastify';
import fastifyCors from '@fastify/cors';

export const HttpHeadersAuthStartWith = "Bearer ";

export default class HttpFastifyServer {

    private readonly instance: FastifyInstance;
    private readonly url: URL;

    private setHealth = true;
    public set HealthSet(value : boolean) {
        this.setHealth = value;
    }
    public get HealthSet() : boolean {
        return this.setHealth;
    }

    public constructor(url: URL, logger: boolean) {
        this.url = url;
        this.instance = fastify({
            caseSensitive: true,
            logger
        });
        this.instance.register(fastifyCors, { origin: "*" });
    }

    public async start(): Promise<void> {
        await this.instance.ready();
        await this.instance.listen({
            port: +this.url.port,
            host: this.url.hostname
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(route: string, options: any): void {
        this.instance.get(route, options);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    post(route: string, options: any): void {
        this.instance.post(route, options);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    put(route: string, options: any): void {
        this.instance.put(route, options);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete(route: string, options: any): void {
        this.instance.delete(route, options);
    }

    /**
     * Used for unit test
     * see https://www.fastify.io/docs/latest/Guides/Testing/#separating-concerns-makes-testing-easy
     */
    async injectPOST(url: string, postData?: unknown, accessToken?: string): Promise<LightMyRequestResponse> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const body = postData as any;
        let response: LightMyRequestResponse;
        if (accessToken) {
            response = await this.instance.inject({
                method: "POST",
                url,
                payload: body,
                headers: {
                    Authorization: HttpHeadersAuthStartWith + accessToken
                }
            });
        } else {
            response = await this.instance.inject({
                method: "POST",
                url,
                payload: body
            });
        }
        return response;
    }

    async injectGET(url: string, accessToken?: string): Promise<LightMyRequestResponse> {
        let response: LightMyRequestResponse;
        if (accessToken) {
            response = await this.instance.inject({
                method: "GET",
                url,
                headers: {
                    Authorization: HttpHeadersAuthStartWith + accessToken
                }
            });
        }
        else {
            response = await this.instance.inject({
                method: "GET",
                url
            });
        }
        return response;
    }

    public async close(): Promise<void> {
        this.instance.close();
    }
}
