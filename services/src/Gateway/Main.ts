import HttpFastifyServer from "../GenericServiceDatabase/HttpFastifyServer";
import graphicArt from "./GraphicArt";
import Gateway from "./Gateway";
import { startService } from "../GenericServiceDatabase/StartService";
import PostgreController from "./Controller/PostgreController";
import MongoController from "./Controller/MongoController";

/***
 * Call of Main function to start Api Gateway service
 */
(async function main() {

    graphicArt();
    const port = process.env.SERVICE_PORT;
    const host = process.env.SERVICEGATEWAY_INGRESS_HOSTS_PATHS_PATH;
    const origin = process.env.WEBAPP_INGRESS_HOSTS_HOST;
    await startService(
        port,
        async (url: URL) => (new Gateway(url, true, origin)),
        async (server: HttpFastifyServer) => {
            await server.documentation(host);
            new MongoController(server);
            new PostgreController(server);
        }
    );

})()


