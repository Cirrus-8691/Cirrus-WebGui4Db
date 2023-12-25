import { FastifyRequest } from "fastify";
import HttpFastifyServer from "../../../serviceGenericDatabase/src/HttpFastifyServer";
import Database from "../../../serviceGenericDatabase/src/Model/Database";
import QueryController from "../../../serviceGenericDatabase/src/Controller/QueryController";
import GetErrorMessage from "../../../serviceGenericDatabase/src/Controller/GetErrorMessage";
import { BodyEntityParameters, QueryEntityParameters, QueryFindParameters } from "../../../serviceGenericDatabase/src/Domain/QueryParameters";
import DbEntity from "../../../serviceGenericDatabase/src/Model/DbEntity";
import { Auth, JwToken } from "../Domain/JwToken";
import PostgreSqlDbUrl from "../Model/PostgreSqlConnect";

export default class PostgreSqlQueryController extends QueryController {

    public constructor(server: HttpFastifyServer, db: Database) {
        super(server, db);

        this.server.get(QueryController.RouteBeginning
            + "postgre/connection/test"
            , {
                handler: this.getTestConnection.bind(this)
            }
        );
        this.server.get(QueryController.RouteBeginning
            + "postgre/connection/auth"
            , {
                handler: this.getAuth.bind(this)
            }
        );
        this.server.get(QueryController.RouteBeginning
            + "postgre/repositories"
            , {
                handler: this.getRepositories.bind(this)
            }
        );
        this.server.get(QueryController.RouteBeginning
            + "postgre/entities"
            , {
                handler: this.getEntities.bind(this)
            }
        );
        this.server.delete(QueryController.RouteBeginning
            + "postgre/entity"
            , {
                handler: this.deleteEntity.bind(this)
            }
        );
        this.server.post(QueryController.RouteBeginning
            + "postgre/entity"
            , {
                handler: this.updateEntity.bind(this)
            }
        );
        this.server.put(QueryController.RouteBeginning
            + "postgre/entity"
            , {
                handler: this.insertEntity.bind(this)
            }
        );

    }

    public async getTestConnection(request: FastifyRequest<{ Querystring: { url: string } }>): Promise<void> {
        try {
            const connectString = new PostgreSqlDbUrl(request.query.url);
            this.db.connect(connectString);
            await this.db.test();
        }
        catch (error) {
            request.log.error(error);
            return Promise.reject(GetErrorMessage(error));
        }
    }

    public async getAuth(request: FastifyRequest<{ Querystring: { url: string } }>): Promise<Auth> {
        try {
            const connectString = new PostgreSqlDbUrl(request.query.url);
            this.db.connect(connectString);
            await this.db.test();
            const auth = JwToken.authDb(connectString);
            return auth;
        }
        catch (error) {
            request.log.error(error);
            return Promise.reject(GetErrorMessage(error));
        }
    }

    public async getRepositories(request: FastifyRequest): Promise<string[]> {
        try {
            const connectString = JwToken.connect(request);
            this.db.connect(connectString);
            return await this.db.getRepositories();
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
            const connectString = JwToken.connect(request);
            this.db.connect(connectString);
            return await this.db.findOnRepository(request.query);
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
            const connectString = JwToken.connect(request);
            this.db.connect(connectString);
            return await this.db.deleteEntity(request.query);
        }
        catch (error) {
            request.log.error(error);
            return Promise.reject(GetErrorMessage(error));
        }
    }

    public async updateEntity(request: FastifyRequest<{
        Querystring: QueryEntityParameters,
        Body : BodyEntityParameters
    }>): Promise<boolean> {
        try {
            const connectString = JwToken.connect(request);
            this.db.connect(connectString);
            return await this.db.updateEntity(request.query, request.body);
        }
        catch (error) {
            request.log.error(error);
            return Promise.reject(GetErrorMessage(error));
        }
    }

    public async insertEntity(request: FastifyRequest<{
        Querystring: QueryEntityParameters,
        Body : BodyEntityParameters
    }>): Promise<boolean> {
        try {
            const connectString = JwToken.connect(request);
            this.db.connect(connectString);
            return await this.db.insertEntity(request.query, request.body);
        }
        catch (error) {
            request.log.error(error);
            return Promise.reject(GetErrorMessage(error));
        }
    }

}