import { FastifyRequest } from "fastify";
import HttpFastifyServer, { Tag } from "../../GenericServiceDatabase/HttpFastifyServer";
import { BodyEntityParameters, QueryEntityParameters, QueryFindParameters } from "../../GenericServiceDatabase/Domain/QueryParameters";
import DbEntity from "../../GenericServiceDatabase/Model/DbEntity";
import BaseController, { DeleteAxios, GetAxios, PostAxios, PutAxios } from "./BaseController";
import GetErrorMessage from "../../GenericServiceDatabase/Controller/GetErrorMessage";
import { Auth } from "../../ServiceMongodb/Domain/JwToken";


export default class GenericDbController extends BaseController {

    private readonly serviceRoute: string;

    public constructor(server: HttpFastifyServer, tag: Tag, serviceRoute: string) {
        super(server);

        this.serviceRoute = serviceRoute;

        this.server.get(`${BaseController.RouteBeginning}${tag.name}/connection/test`, {
            schema: {
                tags: [tag.name],
                description: "Test database connection",
            },
            handler: this.getTestConnection.bind(this)
        }
        );
        this.server.get(`${BaseController.RouteBeginning}${tag.name}/connection/auth`,
            {
                handler: this.getAuth.bind(this)
            }
        );
        this.server.get(`${BaseController.RouteBeginning}${tag.name}/repositories`,
            {
                handler: this.getRepositories.bind(this)
            }
        );
        this.server.get(`${BaseController.RouteBeginning}${tag.name}/entities`,
            {
                handler: this.getEntities.bind(this)
            }
        );
        this.server.delete(`${BaseController.RouteBeginning}${tag.name}/entity`,
            {
                handler: this.deleteEntity.bind(this)
            }
        );
        this.server.post(`${BaseController.RouteBeginning}${tag.name}/entity`,
            {
                handler: this.updateEntity.bind(this)
            }
        );
        this.server.put(`${BaseController.RouteBeginning}${tag.name}/entity`,
            {
                handler: this.insertEntity.bind(this)
            }
        );

    }

    public async getTestConnection(request: FastifyRequest<{ Querystring: { url: string } }>): Promise<void> {
        try {
            const url = request.raw.url ?? "";
            const queryString = url.substring(url.indexOf("?"));
            return await GetAxios<void>(`${this.serviceRoute}connection/test${queryString}`, request);
        }
        catch (error) {
            request.log.error(error);
            return Promise.reject(GetErrorMessage(error));
        }
    }

    public async getAuth(request: FastifyRequest<{ Querystring: { url: string } }>): Promise<Auth> {
        try {
            const url = request.raw.url ?? "";
            const queryString = url.substring(url.indexOf("?"));
            console.log("🟦🟦🟦🟦🟦");
            console.log(url);
            const path = `${this.serviceRoute}connection/auth${queryString}`;
            console.log("🟦🟦🟦🟦🟦");

            return await GetAxios<Auth>(path, request);
        }
        catch (error) {
            console.log("🟥🟥🟥🟥🟥");
            request.log.error(error);
            console.log("🟥🟥🟥🟥🟥");
            return Promise.reject(GetErrorMessage(error));
        }
    }

    public async getRepositories(request: FastifyRequest): Promise<string[]> {
        try {
            return await GetAxios<string[]>(`${this.serviceRoute}repositories`, request);
        }
        catch (error) {
            request.log.error(error);
            return Promise.reject(GetErrorMessage(error));
        }
    }

    public async getEntities(request: FastifyRequest<{
        Querystring: QueryFindParameters
    }>): Promise<DbEntity[]> {
        try {
            const url = request.raw.url ?? "";
            const queryString = url.substring(url.indexOf("?"));
            return await GetAxios<DbEntity[]>(`${this.serviceRoute}entities${queryString}`, request);
        }
        catch (error) {
            request.log.error(error);
            return Promise.reject(GetErrorMessage(error));
        }
    }

    public async deleteEntity(request: FastifyRequest<{
        Querystring: QueryEntityParameters
    }>): Promise<boolean> {
        try {
            const url = request.raw.url ?? "";
            const queryString = url.substring(url.indexOf("?"));
            return await DeleteAxios<boolean>(`${this.serviceRoute}entity${queryString}`, request);
        }
        catch (error) {
            request.log.error(error);
            return Promise.reject(GetErrorMessage(error));
        }
    }

    public async updateEntity(request: FastifyRequest<{
        Querystring: QueryEntityParameters,
        Body: BodyEntityParameters
    }>): Promise<boolean> {
        try {
            const url = request.raw.url ?? "";
            const queryString = url.substring(url.indexOf("?"));
            return await PostAxios<boolean>(`${this.serviceRoute}entity${queryString}`, request);
        }
        catch (error) {
            request.log.error(error);
            return Promise.reject(GetErrorMessage(error));
        }
    }

    public async insertEntity(request: FastifyRequest<{
        Querystring: QueryEntityParameters,
        Body: BodyEntityParameters
    }>): Promise<boolean> {
        try {
            const url = request.raw.url ?? "";
            const queryString = url.substring(url.indexOf("?"));
            return await PutAxios<boolean>(`${this.serviceRoute}entity${queryString}`, request);
        }
        catch (error) {
            request.log.error(error);
            return Promise.reject(GetErrorMessage(error));
        }
    }

}
