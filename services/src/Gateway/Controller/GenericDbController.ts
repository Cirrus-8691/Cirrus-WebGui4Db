import { FastifyRequest } from "fastify";
import HttpFastifyServer, { Tag } from "../../GenericServiceDatabase/HttpFastifyServer";
import { BodyEntityParameters, QueryEntityParameters, QueryFindParameters } from "../../GenericServiceDatabase/Domain/QueryParameters";
import DbEntity from "../../GenericServiceDatabase/Model/DbEntity";
import BaseController, { DeleteAxios, GetAxios, PostAxios, PutAxios } from "./BaseController";
import GetErrorMessage from "../../GenericServiceDatabase/Controller/GetErrorMessage";
import { Auth } from "../../ServiceMongodb/Domain/JwToken";
import { JoiBodyEntityParameters, JoiFindParameters, JoiQueryEntityParameters, JoiRepositoryParameters, JoiUrl } from "./JoiValidation";

export interface DbTag extends Tag {
    repositories: string;
    repository: string;
    entities: string;
    entity: string;
}

export default class GenericDbController extends BaseController {

    private readonly serviceRoute: string;

    public constructor(server: HttpFastifyServer, tag: DbTag, serviceRoute: string) {
        super(server);

        this.serviceRoute = serviceRoute;

        this.server.get(`${BaseController.RouteBeginning}${tag.name}/connection/test`, {
            schema: {
                tags: [tag.name],
                description: "Test database connection",
                querystring: this.JoiToJson(JoiUrl)
            },
            validatorCompiler: this.validate({ querystring: JoiUrl }),
            handler: this.getTestConnection.bind(this)
        });
        this.server.get(`${BaseController.RouteBeginning}${tag.name}/connection/auth`, {
            schema: {
                tags: [tag.name],
                description: "Athenticate to database by connection",
                querystring: this.JoiToJson(JoiUrl)
            },
            validatorCompiler: this.validate({ querystring: JoiUrl }),
            handler: this.getAuth.bind(this)
        });
        this.server.get(`${BaseController.RouteBeginning}${tag.name}/repositories`, {
            schema: {
                tags: [tag.name],
                description: `List of database ${tag.repositories}`,
            },
            validatorCompiler: this.validate({}),
            security: [{ "apiKey": [] }],
            handler: this.getRepositories.bind(this)
        });
        this.server.get(`${BaseController.RouteBeginning}${tag.name}/entities`, {
            schema: {
                tags: [tag.name],
                description: `List of ${tag.entities} of a ${tag.repository}`,
                querystring: this.JoiToJson(JoiFindParameters(tag))
            },
            validatorCompiler: this.validate({ querystring: JoiFindParameters(tag) }),
            security: [{ "apiKey": [] }],
            handler: this.getEntities.bind(this)
        });
        this.server.put(`${BaseController.RouteBeginning}${tag.name}/entity`, {
            schema: {
                tags: [tag.name],
                description: `Insert a ${tag.entity} of a ${tag.repository}`,
                querystring: this.JoiToJson(JoiRepositoryParameters(tag)),
                body: this.JoiToJson(JoiBodyEntityParameters)
            },
            validatorCompiler: this.validate({
                querystring: JoiRepositoryParameters(tag),
                body: JoiBodyEntityParameters
            }),
            security: [{ "apiKey": [] }],
            handler: this.insertEntity.bind(this)
        });
        this.server.post(`${BaseController.RouteBeginning}${tag.name}/entity`, {
            schema: {
                tags: [tag.name],
                description: `Update a ${tag.entity} of a ${tag.repository}`,
                querystring: this.JoiToJson(JoiRepositoryParameters(tag)),
                body: this.JoiToJson(JoiBodyEntityParameters)
            },
            validatorCompiler: this.validate({
                querystring: JoiRepositoryParameters(tag),
                body: JoiBodyEntityParameters
            }),
            security: [{ "apiKey": [] }],
            handler: this.updateEntity.bind(this)
        });
        this.server.delete(`${BaseController.RouteBeginning}${tag.name}/entity`, {
            schema: {
                tags: [tag.name],
                description: `Delete a ${tag.entity} of a ${tag.repository}`,
                querystring: this.JoiToJson(JoiQueryEntityParameters(tag))
            },
            validatorCompiler: this.validate({
                querystring: JoiQueryEntityParameters(tag)
            }),
            security: [{ "apiKey": [] }],
            handler: this.deleteEntity.bind(this)
        });

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
            const path = `${this.serviceRoute}connection/auth${queryString}`;
            return await GetAxios<Auth>(path, request);
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
