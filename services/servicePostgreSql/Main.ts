import { startService } from "../Main";
import HttpFastifyServer from "../serviceGenericDatabase/HttpFastifyServer";
import Database from "../serviceGenericDatabase/Model/Database";
import Service from "../serviceGenericDatabase/Service";
import PostgreSqlQueryController from "./Controller/PostgreSqlQueryController";
import graphicArt from "./GraphicArt";
import PostgreSqlDatabase from "./Model/PostgreSqlDatabase";


/***
 * Call of Main function to start service
 */
(async function main() {

    graphicArt();
    const port = process.env.SERVICE_PORT;
    startService(
        port,
        (url: URL) => (new Service(
            url,
            true,
            new PostgreSqlDatabase(),
            (server: HttpFastifyServer, db: Database) => (new PostgreSqlQueryController(server, db)))
        ));

})()


