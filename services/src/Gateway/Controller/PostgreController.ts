import HttpFastifyServer from "../../GenericServiceDatabase/HttpFastifyServer";
import QueryController from "./QueryController";
import GenericDbController from "./GenericDbController";

export default class PostgreController extends GenericDbController {

    public constructor(server: HttpFastifyServer) {

        const namespace = process.env.SERVICE_NAMESPACE;
        const serviceHost = process.env.SERVICE_POSTGRESQL_NAME ?? "127.0.0.1:4002";
        const servicePort = process.env.SERVICE_POSTGRESQL_PORT ?? "4002";
        const serviceRoute = `http://${serviceHost}${namespace ? namespace + "." : ""}:${servicePort}${QueryController.RouteBeginning}`;

        super(server, "postgre", serviceRoute);
    }

}