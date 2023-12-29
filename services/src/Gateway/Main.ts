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
    const host = process.env.APIGATEWAY_INGRESS_HOST_PATH;
    await startService(
        port,
        async (url: URL) => (new Gateway(url, true)),
        async (server: HttpFastifyServer) => {
            await server.documentation(host);
            new MongoController(server);
            new PostgreController(server);
        }
    );

})()


