import { startService } from "../Main";
import HttpFastifyServer from "../GenericServiceDatabase/HttpFastifyServer";
import Database from "../GenericServiceDatabase/Model/Database";
import Service from "../GenericServiceDatabase/Service";
import MongoQueryController from "./Controller/MongoQueryController";
import graphicArt from "./GraphicArt";
import MongoDatabase from "./Model/MongoDatabase";



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
            new MongoDatabase(),
            (server: HttpFastifyServer, db: Database) => (new MongoQueryController(server, db)))
        ));

})()


