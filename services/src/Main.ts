import Gateway from "./Gateway/Gateway";
import graphicArtGateway from "./Gateway/GraphicArt";

import MongoGatewayController from "./Gateway/Controller/MongoController";
import PostgrGatewayController from "./Gateway/Controller/PostgreController";

import graphicArtMongodb from "./ServiceMongodb/GraphicArt";
import MongoController from "./ServiceMongodb/Controller/MongoController";
import MongoDatabase from "./ServiceMongodb/Model/MongoDatabase";

import graphicArtPostgre from "./ServicePostgreSql/GraphicArt";
import PostgreController from "./ServicePostgreSql/Controller/PostgreSqlController";
import PostgreSqlDatabase from "./ServicePostgreSql/Model/PostgreSqlDatabase";
import Service from "./GenericServiceDatabase/Service";
import HttpFastifyServer from "./GenericServiceDatabase/HttpFastifyServer";
import Database from "./GenericServiceDatabase/Model/Database";
import { startService } from "./GenericServiceDatabase/StartService";

/***
 * Call main function to start all services
 */
(async function main() {

    // Starting API gateway
    const portGateway = process.env.SERVICE_PORT; // expecting 4000
    const portApiGateway = parseInt(portGateway ?? "4000");
    graphicArtGateway();
    startService(
        portGateway,
        (url: URL) => (new Gateway(
            url,
            true,
            (server: HttpFastifyServer) => {
                new MongoGatewayController(server);
                new PostgrGatewayController(server);
            })
        ));
    // Starting services...
    graphicArtMongodb();
    const postMongo = (portApiGateway + 1).toString();
    startService(
        postMongo,
        (url: URL) => (new Service({
            name: "mongodb",
            url,
            logger: true,
            db: new MongoDatabase()
        },
            (server: HttpFastifyServer, db: Database) => (new MongoController(server, db)))
        ));

    graphicArtPostgre();
    const portPostgre = (portApiGateway + 2).toString();
    startService(
        portPostgre,
        (url: URL) => (new Service({
            name: "postgresql",
            url,
            logger: true,
            db: new PostgreSqlDatabase()
        },
            (server: HttpFastifyServer, db: Database) => (new PostgreController(server, db)))
        ));

})()
