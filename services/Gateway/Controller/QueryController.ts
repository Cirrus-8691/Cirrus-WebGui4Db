import { FastifyRequest } from "fastify";
import HttpFastifyServer from "../HttpFastifyServer";
import Database from "../Model/Database";
import GetErrorMessage from "./GetErrorMessage";

export default class QueryController {

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

    public async getHealth(request: FastifyRequest): Promise<string> {
        try {
            return "Ok at " + Date.now();
        }
        catch (error) {
            request.log.error(error);
            return Promise.reject(GetErrorMessage(error));
        }
    }

}