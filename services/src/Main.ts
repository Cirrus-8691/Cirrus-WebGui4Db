import Gateway from "./Gateway/Gateway";
import graphicArtGateway from "./Gateway/GraphicArt";

import graphicArtMongodb from "./ServiceMongodb/GraphicArt";
import MongoQueryController from "./ServiceMongodb/Controller/MongoQueryController";
import MongoDatabase from "./ServiceMongodb/Model/MongoDatabase";

import graphicArtPostgre from "./ServicePostgreSql/GraphicArt";
import PostgreSqlQueryController from "./ServicePostgreSql/Controller/PostgreSqlQueryController";
import PostgreSqlDatabase from "./ServicePostgreSql/Model/PostgreSqlDatabase";
import Service from "./GenericServiceDatabase/Service";
import HttpFastifyServer from "./GenericServiceDatabase/HttpFastifyServer";
import Database from "./GenericServiceDatabase/Model/Database";
import { startService } from "./GenericServiceDatabase/StartService";

/***
 * Call of Main function to start service
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
                //
            })
        ));

    graphicArtMongodb();
    const postMongo = (portApiGateway + 1).toString();
    startService(
        postMongo,
        (url: URL) => (new Service(
            url,
            true,
            new MongoDatabase(),
            (server: HttpFastifyServer, db: Database) => (new MongoQueryController(server, db)))
        ));

    graphicArtPostgre();
    const portPostgre = (portApiGateway + 2).toString();
    startService(
        portPostgre,
        (url: URL) => (new Service(
            url,
            true,
            new PostgreSqlDatabase(),
            (server: HttpFastifyServer, db: Database) => (new PostgreSqlQueryController(server, db)))
        ));

})()
