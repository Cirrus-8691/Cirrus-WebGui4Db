import fastify, { FastifyInstance, FastifyPluginOptions, FastifyRegisterOptions, FastifyReply, FastifyRequest, LightMyRequestResponse } from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyAuth, { FastifyAuthFunction } from "@fastify/auth";
import Joi from 'joi';
import { GenericJwToken } from './Domain/GenericJwToken';

export const HttpHeadersAuthStartWith = "Bearer ";

export interface Tag {
    name: string,
    description: string
}

export interface ServerOptions {
    url: URL;
    origin?: string;   // CORS
    logger: boolean;
    name: string,
    description: string,
    version: number,
    tags: Tag[]
}

export interface Credentials {
    validatedUserPassword?: boolean;
}

export type Validator = (data: unknown) => Joi.ValidationResult<unknown>;

export interface Schema {
    tags?: string[];
    description?: string;
    querystring?: unknown;
    body?: unknown;
    // header?: unknown;
}

export default class HttpFastifyServer {

    private readonly instance: FastifyInstance;
    public readonly options: ServerOptions;

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
        this.instance.register(fastifyCors, { origin: options.origin ?? "*" });
        this.instance.addContentTypeParser("*", (request, payload, done) => (done(null)));

        // Authorization
        this.instance.decorate('validatedUserPassword', this.validatedUserPassword);
        this.instance.register(fastifyAuth);
    }

    public async start(): Promise<void> {
        await this.instance.ready();
        if (this.externalPath) {
            this.instance.swagger();
            console.log("📘 Swagger documentation available at " + this.docUrl);
        }

        await this.instance.listen({
            port: +this.options.url.port,
            host: this.options.url.hostname
        });
    }

    private async validatedUserPassword(request: FastifyRequest, reply: FastifyReply) {
        const accessToken = GenericJwToken.extractToken(request);
        if (!accessToken) {
            reply.statusCode = 403
            throw new Error("Forbidden credentials is undefined");
        }
        const url = GenericJwToken.valideAccessToken(accessToken);
        if (!url) {
            reply.statusCode = 403
            throw new Error("Forbidden invalid credentials")
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getValidateCredentials(requiredCredentials: Credentials, instance: any): FastifyAuthFunction[] {
        const functions: FastifyAuthFunction[] = [];
        if (requiredCredentials.validatedUserPassword) {
            functions.push(instance.validatedUserPassword);
        }
        return functions;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(route: string, options: any, requiredCredentials?: Credentials): void {
        const validatedUserPassword = requiredCredentials?.validatedUserPassword;
        if (validatedUserPassword) {
            this.instance.after(() => {
                options.preHandler = this.instance.auth(this.getValidateCredentials({ validatedUserPassword }, this.instance));
                this.instance.get(route, options);
            })
        }
        else {

            this.instance.get(route, options);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    post(route: string, options: any, requiredCredentials?: Credentials): void {
        const validatedUserPassword = requiredCredentials?.validatedUserPassword;
        if (validatedUserPassword) {
            this.instance.after(() => {
                options.preHandler = this.instance.auth(this.getValidateCredentials({ validatedUserPassword }, this.instance));
                this.instance.post(route, options);
            })
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.instance.post(route, options);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    put(route: string, options: any, requiredCredentials?: Credentials): void {
        const validatedUserPassword = requiredCredentials?.validatedUserPassword;
        if (validatedUserPassword) {
            this.instance.after(() => {
                options.preHandler = this.instance.auth(this.getValidateCredentials({ validatedUserPassword }, this.instance));
                this.instance.put(route, options);
            })
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.instance.put(route, options);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete(route: string, options: any, requiredCredentials?: Credentials): void {
        const validatedUserPassword = requiredCredentials?.validatedUserPassword;
        if (validatedUserPassword) {
            this.instance.after(() => {
                options.preHandler = this.instance.auth(this.getValidateCredentials({ validatedUserPassword }, this.instance));
                this.instance.delete(route, options);
            })
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.instance.delete(route, options);
        }
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

    private externalPath: string | undefined = undefined;
    get docUrl(): string {
        return this.options.url.protocol + "//" + this.externalPath + HttpFastifyServer.SwaggerRoutePrefix;
    }

    async documentation(externalHost: string | undefined): Promise<void> {
        if (externalHost) {
            // externalPath expecting: /cirrus-webgui4db-gateway(/|$)(.*)
            // or `localhost:4000`
            const pOfAccolad = externalHost.indexOf("(");
            if (pOfAccolad > 0) {
                externalHost = externalHost.substring(0, pOfAccolad);
            }
            this.externalPath = externalHost;
            const host = externalHost ?? this.options.url.host;
            const swaggerOpts: FastifyRegisterOptions<FastifyPluginOptions> = {
                routePrefix: HttpFastifyServer.SwaggerRoutePrefix,
                exposeRoute: true,
                hideUntagged: true,
                swagger: {
                    host,
                    schemes: [this.options.url.protocol.replace(":", "")],
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
    }

    public async close(): Promise<void> {
        this.instance.close();
    }
}
