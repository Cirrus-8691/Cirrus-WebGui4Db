import HttpFastifyServer from "../GenericServiceDatabase/HttpFastifyServer";
import Database from "../GenericServiceDatabase/Model/Database";
import Service from "../GenericServiceDatabase/Service";
import { startService } from "../GenericServiceDatabase/StartService";
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


