import HttpFastifyServer from "../GenericServiceDatabase/HttpFastifyServer";
import Database from "../GenericServiceDatabase/Model/Database";
import Service from "../GenericServiceDatabase/Service";
import { startService } from "../GenericServiceDatabase/StartService";
import MongoController from "./Controller/MongoController";
import graphicArt from "./GraphicArt";
import MongoDatabase from "./Model/MongoDatabase";



/***
 * Call main function to start service
 */
(async function main() {

    graphicArt();
    const port = process.env.SERVICE_PORT;
    startService(
        port,
        (url: URL) => (new Service({
            name: "mongodb",
            url,
            logger: true,
            db: new MongoDatabase()
        },
            (server: HttpFastifyServer, db: Database) => (new MongoController(server, db)))
        ));

})()


