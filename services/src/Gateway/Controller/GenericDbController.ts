import { FastifyRequest } from "fastify";
import HttpFastifyServer from "../../GenericServiceDatabase/HttpFastifyServer";
import { BodyEntityParameters, QueryEntityParameters, QueryFindParameters } from "../../GenericServiceDatabase/Domain/QueryParameters";
import DbEntity from "../../GenericServiceDatabase/Model/DbEntity";
import QueryController, { DeleteAxios, GetAxios, PostAxios, PutAxios } from "./QueryController";
import GetErrorMessage from "../../GenericServiceDatabase/Controller/GetErrorMessage";
import { Auth } from "../../ServiceMongodb/Domain/JwToken";


export default class GenericDbController extends QueryController {

    private readonly serviceRoute: string;

    public constructor(server: HttpFastifyServer, serviceName: string, serviceRoute: string) {
        super(server);

        this.serviceRoute = serviceRoute;

        this.server.get(`${QueryController.RouteBeginning}${serviceName}/connection/test`
            , {
                handler: this.getTestConnection.bind(this)
            }
        );
        this.server.get(`${QueryController.RouteBeginning}${serviceName}/connection/auth`
            , {
                handler: this.getAuth.bind(this)
            }
        );
        this.server.get(`${QueryController.RouteBeginning}${serviceName}/repositories`
            , {
                handler: this.getRepositories.bind(this)
            }
        );
        this.server.get(`${QueryController.RouteBeginning}${serviceName}/entities`
            , {
                handler: this.getEntities.bind(this)
            }
        );
        this.server.delete(`${QueryController.RouteBeginning}${serviceName}/entity`
            , {
                handler: this.deleteEntity.bind(this)
            }
        );
        this.server.post(`${QueryController.RouteBeginning}${serviceName}/entity`
            , {
                handler: this.updateEntity.bind(this)
            }
        );
        this.server.put(`${QueryController.RouteBeginning}${serviceName}/entity`
            , {
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
            return await GetAxios<Auth>(`${this.serviceRoute}connection/auth${queryString}`, request);
        }
        catch (error) {
            request.log.error(error);
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
