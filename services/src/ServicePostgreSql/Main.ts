import HttpFastifyServer from "../GenericServiceDatabase/HttpFastifyServer";
import Database from "../GenericServiceDatabase/Model/Database";
import Service from "../GenericServiceDatabase/Service";
import { startService } from "../GenericServiceDatabase/StartService";
import PostgreSqlController from "./Controller/PostgreSqlController";
import graphicArt from "./GraphicArt";
import PostgreSqlDatabase from "./Model/PostgreSqlDatabase";


/***
 * Call main function to start service
 */
(async function main() {

    graphicArt();
    const host = process.env.SERVICE_HOST;
    const port = process.env.SERVICE_PORT;
    await startService(
        "http", host, port,
        async (url: URL) => (
            new Service(
                {
                    name: "postgresql",
                    url,
                    logger: true,
                    db: new PostgreSqlDatabase()
                },
                (server: HttpFastifyServer, db: Database) => (new PostgreSqlController(server, db))
            )
        )
    );

})()


