import { FastifyRequest } from "fastify";
import HttpFastifyServer, { Tag } from "../../GenericServiceDatabase/HttpFastifyServer";
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
                handler: this.getHealth.bind(this)
            });
        }

    }

    public async getHealth(request: FastifyRequest): Promise<string> {
        try {
            return "Gateway OK at " + Date.now();
        }
        catch (error) {
            request.log.error(error);
            return Promise.reject(GetErrorMessage(error));
        }
    }

}
