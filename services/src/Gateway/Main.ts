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
    const host = process.env.SERVICE_HOST;
    const port = process.env.SERVICE_PORT;
    const gatewayHost = process.env.SERVICEGATEWAY_INGRESS_HOSTS_PATHS_PATH;
    const origin = process.env.WEBAPP_INGRESS_HOSTS_HOST;
    const protocol = gatewayHost===undefined ? "http" : "https";
    await startService(
        protocol, host, port,
        async (url: URL) => (new Gateway(url, true, origin)),
        async (server: HttpFastifyServer) => {
            await server.documentation(gatewayHost);
            new MongoController(server);
            new PostgreController(server);
        }
    );

})()


