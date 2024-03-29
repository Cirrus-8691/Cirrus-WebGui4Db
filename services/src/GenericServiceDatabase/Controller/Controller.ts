import { FastifyRequest } from "fastify";
import HttpFastifyServer from "../HttpFastifyServer";
import Database from "../Model/Database";
import GetErrorMessage from "./GetErrorMessage";

export default class Controller {

    public static RouteBeginning = "/api/v1/";

    protected readonly server: HttpFastifyServer;
    protected readonly db: Database;

    public constructor(server: HttpFastifyServer, db: Database) {

        this.db = db;
        this.server = server;

        this.server.get("/"
            , {
                handler: this.getHealth.bind(this)
            }
        );

    }

    public async dispose(): Promise<void> {
        this.db.dispose();
    }

    public async getHealth(request: FastifyRequest): Promise<string> {
        try {
            return `Service ${this.server.options.name} Ok at ${Date.now()}`;
        }
        catch (error) {
            request.log.error(error);
            return Promise.reject(GetErrorMessage(error));
        }
    }

}