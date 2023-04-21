import { FastifyRequest } from "fastify";
import HttpFastifyServer from "../HttpFastifyServer";
import DbDocument from "../Domain/DbDocument";
import Database from "../Domain/Database";
import MongoDbUrl from "../Domain/MongoDbUrl";
import GetErrorMessage from "./GetErrorMessage";
import { BodyDocumentParameters, QueryDocumentParameters, QueryFindParameters } from "../Domain/QueryParameters";
import { Auth, JwToken } from "../Domain/JwToken";

export default class QueryController {

    static RouteBeginning = "/api/v1/";

    private readonly server: HttpFastifyServer;
    private readonly db: Database;

    public constructor(server: HttpFastifyServer, db: Database) {

        this.db = db;
        this.server = server;

        this.server.get("/"
            , {
                handler: this.getHealth.bind(this)
            }
        );
        this.server.get(QueryController.RouteBeginning
            + "mongo/connection/test"
            , {
                handler: this.getTestConnection.bind(this)
            }
        );
        this.server.get(QueryController.RouteBeginning
            + "mongo/connection/auth"
            , {
                handler: this.getAuth.bind(this)
            }
        );
        this.server.get(QueryController.RouteBeginning
            + "mongo/collections"
            , {
                handler: this.getCollections.bind(this)
            }
        );
        this.server.get(QueryController.RouteBeginning
            + "mongo/documents"
            , {
                handler: this.getDocuments.bind(this)
            }
        );
        this.server.delete(QueryController.RouteBeginning
            + "mongo/document"
            , {
                handler: this.deleteDocument.bind(this)
            }
        );
        this.server.post(QueryController.RouteBeginning
            + "mongo/document"
            , {
                handler: this.updateDocument.bind(this)
            }
        );
        this.server.put(QueryController.RouteBeginning
            + "mongo/document"
            , {
                handler: this.insertDocument.bind(this)
            }
        );

    }

    public async getHealth(request: FastifyRequest): Promise<string> {
        try {
            return "Ok at " + Date.now();
        }
        catch (error) {
            request.log.error(error);
            return Promise.reject(GetErrorMessage(error));
        }
    }

    public async getTestConnection(request: FastifyRequest<{ Querystring: { url: string } }>): Promise<void> {
        try {
            const mongoUrl = new MongoDbUrl(request.query.url);
            this.db.connect(mongoUrl.toUrl());
            await this.db.test();
        }
        catch (error) {
            request.log.error(error);
            return Promise.reject(GetErrorMessage(error));
        }
    }

    public async getAuth(request: FastifyRequest<{ Querystring: { url: string } }>): Promise<Auth> {
        try {
            const mongoUrl = new MongoDbUrl(request.query.url);
            this.db.connect(mongoUrl.toUrl());
            await this.db.test();
            const auth = JwToken.authMongoDb(mongoUrl);
            return auth;
        }
        catch (error) {
            request.log.error(error);
            return Promise.reject(GetErrorMessage(error));
        }
    }

    public async getCollections(request: FastifyRequest): Promise<string[]> {
        try {
            const mongoUrl = JwToken.connect(request);
            this.db.connect(mongoUrl.toUrl());
            return await this.db.getCollections();
        }
        catch (error) {
            request.log.error(error);
            return Promise.reject(GetErrorMessage(error));
        }
    }

    public async getDocuments(request: FastifyRequest<{
        Querystring: QueryFindParameters
    }>): Promise<DbDocument[]> {
        try {
            const mongoUrl = JwToken.connect(request);
            this.db.connect(mongoUrl.toUrl());
            return await this.db.findOnCollection(request.query);
        }
        catch (error) {
            request.log.error(error);
            return Promise.reject(GetErrorMessage(error));
        }
    }

    public async deleteDocument(request: FastifyRequest<{
        Querystring: QueryDocumentParameters
    }>): Promise<boolean> {
        try {
            const mongoUrl = JwToken.connect(request);
            this.db.connect(mongoUrl.toUrl());
            return await this.db.deleteDocument(request.query);
        }
        catch (error) {
            request.log.error(error);
            return Promise.reject(GetErrorMessage(error));
        }
    }

    public async updateDocument(request: FastifyRequest<{
        Querystring: QueryDocumentParameters,
        Body : BodyDocumentParameters
    }>): Promise<boolean> {
        try {
            const mongoUrl = JwToken.connect(request);
            this.db.connect(mongoUrl.toUrl());
            return await this.db.updateDocument(request.query, request.body);
        }
        catch (error) {
            request.log.error(error);
            return Promise.reject(GetErrorMessage(error));
        }
    }

    public async insertDocument(request: FastifyRequest<{
        Querystring: QueryDocumentParameters,
        Body : BodyDocumentParameters
    }>): Promise<boolean> {
        try {
            const mongoUrl = JwToken.connect(request);
            this.db.connect(mongoUrl.toUrl());
            return await this.db.insertDocument(request.query, request.body);
        }
        catch (error) {
            request.log.error(error);
            return Promise.reject(GetErrorMessage(error));
        }
    }

}