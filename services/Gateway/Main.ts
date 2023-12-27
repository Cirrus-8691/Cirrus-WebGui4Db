import { startService } from "../Main";
import HttpFastifyServer from "../GenericServiceDatabase/HttpFastifyServer";
import graphicArt from "./GraphicArt";
import Gateway from "./Gateway";

/***
 * Call of Main function to start Api Gateway service
 */
(async function main() {

    graphicArt();
    const port = process.env.SERVICE_PORT;
    startService(
        port,
        (url: URL) => (new Gateway(
            url,
            true,
            (server: HttpFastifyServer) => {
                //
            })
        ));

})()


