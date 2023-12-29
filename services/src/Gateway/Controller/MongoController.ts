import HttpFastifyServer, { Tag } from "../../GenericServiceDatabase/HttpFastifyServer";
import BaseController from "./BaseController";
import GenericDbController from "./GenericDbController";

export default class MongoController extends GenericDbController {

    static Tag: Tag = {
        name: "mongo",
        description: "MongoDb service provider"
    };

    public constructor(server: HttpFastifyServer) {

        const namespace = process.env.SERVICE_NAMESPACE;
        const serviceHost = process.env.SERVICE_MONGODB_NAME ?? "127.0.0.1";
        const servicePort = process.env.SERVICE_MONGODB_PORT ?? "4001";
        const serviceRoute = `http://${serviceHost}${namespace ? "." + namespace : ""}:${servicePort}${BaseController.RouteBeginning}`;

        super(server, MongoController.Tag, serviceRoute);

    }

}