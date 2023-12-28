import HttpFastifyServer from "../../GenericServiceDatabase/HttpFastifyServer";
import QueryController from "./QueryController";
import GenericDbController from "./GenericDbController";

export default class MongoController extends GenericDbController {

    public constructor(server: HttpFastifyServer) {

        const namespace = process.env.SERVICE_NAMESPACE;
        const serviceHost = process.env.SERVICE_MONGODB_NAME ?? "127.0.0.1";
        const servicePort = process.env.SERVICE_MONGODB_PORT ?? "4001";
        const serviceRoute = `http://${serviceHost}${namespace ? "." + namespace : ""}:${servicePort}${QueryController.RouteBeginning}`;

        super(server, "mongo", serviceRoute);

    }

}