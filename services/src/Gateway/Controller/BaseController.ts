import Joi from "joi";
import parseJoi from "joi-to-json";
import { FastifyRequest } from "fastify";
import HttpFastifyServer, { Schema, Tag, Validator } from "../../GenericServiceDatabase/HttpFastifyServer";
import GetErrorMessage from "../../GenericServiceDatabase/Controller/GetErrorMessage";
import axios, { AxiosResponse } from "axios";

export async function GetAxios<T>(path: string, request: FastifyRequest): Promise<T> {
    const config = request.headers ? { headers: request.headers } : undefined;
    return (await axios.get<T, AxiosResponse<T>>(path, config)).data;
}

export async function PostAxios<T>(path: string, request: FastifyRequest): Promise<T> {
    const config = request.headers ? { headers: request.headers } : undefined;
    const body = request.body;
    return (await axios.post<T, AxiosResponse<T>>(path, body, config)).data;
}

export async function DeleteAxios<T>(path: string, request: FastifyRequest): Promise<T> {
    const config = request.headers ? { headers: request.headers } : undefined;
    return (await axios.delete<T, AxiosResponse<T>>(path, config)).data;
}

export async function PutAxios<T>(path: string, request: FastifyRequest): Promise<T> {
    const config = request.headers ? { headers: request.headers } : undefined;
    const body = request.body;
    return (await axios.put<T, AxiosResponse<T>>(path, body, config)).data;
}

export default class BaseController {

    static Tag: Tag = {
        name: "probes",
        description: "Kubernetes liveness and readyness probes"
    };

    public static RouteBeginning = "/api/v1/";

    protected readonly server: HttpFastifyServer;

    public constructor(server: HttpFastifyServer) {

        this.server = server;
        if (server.HealthSet) {
            server.HealthSet = false;
            this.server.get("/", {
                schema: {
                    tags: [BaseController.Tag.name],
                    description: "Get health",
                },
                validatorCompiler: this.validate({}),
                handler: this.getHealth.bind(this)
            });
        }

    }

    public async getHealth(request: FastifyRequest): Promise<string> {
        try {
            return `Gateway OK at ${Date.now()}`;
        }
        catch (error) {
            request.log.error(error);
            return Promise.reject(GetErrorMessage(error));
        }
    }

    protected JoiToJson(joiSchema: Joi.PartialSchemaMap) : unknown {
        return parseJoi(Joi.object(joiSchema));
    }

    validate(schema: Schema): (props: { httpPart: string }) => Validator {
        return (props: { httpPart: string }) => this.validator(props.httpPart, schema)
    }

    private validator(httpPart: string, schema: Schema) {
        return (data: unknown): Joi.ValidationResult<unknown> => {
            let joiSchema;
            if (httpPart === "body") {
                joiSchema = Joi.object(schema.body as Joi.PartialSchemaMap);
            }
            else {
                joiSchema = Joi.object(schema.querystring as Joi.PartialSchemaMap);
            }
            const validatedData = joiSchema.validate(data);
            if (validatedData.error != undefined) {
                // statusCode: 400
                throw new Error(validatedData.error.details[0].message);
            }
            return validatedData;
        }
    }

}
