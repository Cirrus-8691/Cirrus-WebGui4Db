import { assert } from "chai";
import { TestLocalMongoDbName, TestLocalMongoDbUrl, TestLocalMongoDbUser } from "./TestMongoDb";
import Service from "../GenericServiceDatabase/Service";
import StubDatabase from "../GenericServiceDatabase/Model/StubDatabase";
import HttpFastifyServer from "../GenericServiceDatabase/HttpFastifyServer";
import Database from "../GenericServiceDatabase/Model/Database";
import QueryController from "../Gateway/Controller/QueryController";
import { Auth } from "../ServiceMongodb/Domain/JwToken";
import MongoController from "../ServiceMongodb/Controller/MongoController";

export const TestServiceUrl = "http://localhost:3000/";

export default async function TestServiceMongo(): Promise<void> {

    const service = new Service(
        new URL(TestServiceUrl),
        false,
        new StubDatabase(),
        (server: HttpFastifyServer, db: Database) => (new MongoController(server, db)));
    try {
        let url = QueryController.RouteBeginning + "connection/test"
            + "?url=" + encodeURIComponent(TestLocalMongoDbUrl);
        let response = await service.Server.injectGET(url);
        assert.equal(response.statusCode, 200, `GET ${url} ${response.statusMessage}`);

        url = QueryController.RouteBeginning + "connection/auth"
            + "?url=" + encodeURIComponent(TestLocalMongoDbUrl);
        response = await service.Server.injectGET(url);
        assert.equal(response.statusCode, 200, `GET ${url} ${response.statusMessage}`);
        const auth = JSON.parse(response.body) as Auth;
        const accessToken = auth.accessToken;
        assert.isTrue(accessToken !== "");
        assert.isTrue(auth.userName === TestLocalMongoDbUser);
        assert.isTrue(auth.dbName === TestLocalMongoDbName);
        assert.isTrue(auth.dbProvider !== "");

        url = QueryController.RouteBeginning + "repositories";
        response = await service.Server.injectGET(url, accessToken);
        assert.equal(response.statusCode, 200, `GET ${url} ${response.statusMessage}`);
        const collections = JSON.parse(response.body);
        const collectionName = collections[0];

        url = QueryController.RouteBeginning + "entities"
            + "?from=" + encodeURIComponent(collectionName)
            + "&what=" + encodeURIComponent("{}");
        response = await service.Server.injectGET(url, accessToken);
        assert.equal(response.statusCode, 200, `GET ${url} ${response.statusMessage}`);

    }
    finally {
        service.dispose();
    }
}