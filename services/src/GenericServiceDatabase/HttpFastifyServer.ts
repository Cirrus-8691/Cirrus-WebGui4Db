import fastify, { FastifyInstance, FastifyPluginOptions, FastifyRegisterOptions, LightMyRequestResponse } from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

export const HttpHeadersAuthStartWith = "Bearer ";

export interface Tag {
    name: string,
    description: string
}
export interface ServerOptions {
    url: URL;
    logger: boolean;
    name: string,
    description: string,
    version: number,
    tags: Tag[]
}

export default class HttpFastifyServer {

    private readonly instance: FastifyInstance;
    private readonly options: ServerOptions;

    private setHealth = true;
    public set HealthSet(value: boolean) {
        this.setHealth = value;
    }
    public get HealthSet(): boolean {
        return this.setHealth;
    }

    public constructor(options: ServerOptions) {
        this.options = options;
        this.instance = fastify({
            caseSensitive: true,
            logger: options.logger
        });
        this.instance.register(fastifyCors, { origin: "*" });
    }

    public async start(): Promise<void> {
        await this.instance.ready();
        if (this.externalPath) {
            this.instance.swagger();
        }
        await this.instance.listen({
            port: +this.options.url.port,
            host: this.options.url.hostname
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

    static SwaggerRoutePrefix = "/documentation";

    private externalPath = "";
    get docUrl(): string {
        return this.externalPath + HttpFastifyServer.SwaggerRoutePrefix;
    }

    async documentation(externalPath: string): Promise<void> {
        this.externalPath = externalPath;
        const swaggerOpts: FastifyRegisterOptions<FastifyPluginOptions> = {
            routePrefix: HttpFastifyServer.SwaggerRoutePrefix,
            exposeRoute: true,
            hideUntagged: true,
            swagger: {
                host: `${this.options.url.host}:${this.options.url.port}`,
                schemes: [this.options.url.protocol],
                info: {
                    title: "Service: " + this.options.name,
                    description: this.options.description,
                    version: this.options.version.toPrecision(2)
                },
                tags: this.options.tags,
                securityDefinitions: {
                    apiKey: {
                        // https://swagger.io/docs/specification/authentication/api-keys/
                        type: "apiKey",
                        in: "header",
                        name: "authorization",
                        description: `This API uses Value equal to 'Bearer [authToken]'`
                    }
                }
            }
        };
        await this.instance.register(fastifySwagger, swaggerOpts);
        await this.instance.register(fastifySwaggerUi, swaggerOpts);
    }

    public async close(): Promise<void> {
        this.instance.close();
    }
}
