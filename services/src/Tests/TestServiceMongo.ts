import { assert } from "chai";
import { TestLocalMongoDbName, TestLocalMongoDbUrl, TestLocalMongoDbUser } from "./TestMongoDb";
import Service from "../GenericServiceDatabase/Service";
import StubDatabase from "../GenericServiceDatabase/Model/StubDatabase";
import HttpFastifyServer from "../GenericServiceDatabase/HttpFastifyServer";
import Database from "../GenericServiceDatabase/Model/Database";
import BaseController from "../Gateway/Controller/BaseController";
import MongoController from "../ServiceMongodb/Controller/MongoController";
import { Auth } from "../GenericServiceDatabase/Domain/GenericJwToken";

export const TestServiceUrl = "http://localhost:3000/";

export default async function TestServiceMongo(): Promise<void> {

    const service = new Service({
        name: "mongodb",
        url: new URL(TestServiceUrl),
        logger: false,
        db: new StubDatabase()
    },
        (server: HttpFastifyServer, db: Database) => (new MongoController(server, db)));
    try {
        let url = BaseController.RouteBeginning + "connection/test"
            + "?url=" + encodeURIComponent(TestLocalMongoDbUrl);
        let response = await service.server.injectGET(url);
        assert.equal(response.statusCode, 200, `GET ${url} ${response.statusMessage}`);

        url = BaseController.RouteBeginning + "connection/auth"
            + "?url=" + encodeURIComponent(TestLocalMongoDbUrl);
        response = await service.server.injectGET(url);
        assert.equal(response.statusCode, 200, `GET ${url} ${response.statusMessage}`);
        const auth = JSON.parse(response.body) as Auth;
        const accessToken = auth.accessToken;
        assert.isTrue(accessToken !== "");
        assert.isTrue(auth.userName === TestLocalMongoDbUser);
        assert.isTrue(auth.dbName === TestLocalMongoDbName);
        assert.isTrue(auth.dbProvider !== "");

        url = BaseController.RouteBeginning + "repositories";
        response = await service.server.injectGET(url, accessToken);
        assert.equal(response.statusCode, 200, `GET ${url} ${response.statusMessage}`);
        const collections = JSON.parse(response.body);
        const collectionName = collections[0];

        url = BaseController.RouteBeginning + "entities"
            + "?from=" + encodeURIComponent(collectionName)
            + "&what=" + encodeURIComponent("{}");
        response = await service.server.injectGET(url, accessToken);
        assert.equal(response.statusCode, 200, `GET ${url} ${response.statusMessage}`);

    }
    finally {
        service.dispose();
    }
}