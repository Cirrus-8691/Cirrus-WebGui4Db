import HttpFastifyServer from "../../GenericServiceDatabase/HttpFastifyServer";
import QueryController from "./QueryController";
import GenericDbController from "./GenericDbController";

export default class PostgreController extends GenericDbController {

    public constructor(server: HttpFastifyServer) {

        const namespace = undefined;
        const serviceUrl = "127.0.0.1:4002";
        const serviceRoute = `http://${namespace ? namespace + "." : ""}${serviceUrl}${QueryController.RouteBeginning}`;

        super(server, "postgre", serviceRoute);
    }

}