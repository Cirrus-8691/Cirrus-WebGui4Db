import { assert } from "chai";
import Service from "../../serviceGenericDatabase/Service";
import QueryController from "../../serviceGenericDatabase/Controller/QueryController";
import { TestLocalMongoDbName, TestLocalMongoDbUrl, TestLocalMongoDbUser } from "./TestMongoDb";
import { Auth } from "../Domain/JwToken";
import StubDatabase from "../../serviceGenericDatabase/Model/StubDatabase";
import HttpFastifyServer from "../../serviceGenericDatabase/HttpFastifyServer";
import Database from "../../serviceGenericDatabase/Model/Database";
import MongoQueryController from "../Controller/MongoQueryController";

export const TestServiceUrl = "http://localhost:3000/";

export default async function TestService(): Promise<void> {

    const service = new Service(
        new URL(TestServiceUrl), 
        false, 
        new StubDatabase(),
        (server: HttpFastifyServer, db : Database) => (new MongoQueryController(server, db )));
    try {
        let url = QueryController.RouteBeginning + "mongo/connection/test"
            + "?url=" + encodeURIComponent(TestLocalMongoDbUrl);
        let response = await service.Server.injectGET(url);
        assert.equal(response.statusCode, 200, `GET ${url} ${response.statusMessage}`);

        url = QueryController.RouteBeginning + "mongo/connection/auth"
            + "?url=" + encodeURIComponent(TestLocalMongoDbUrl);
        response = await service.Server.injectGET(url);
        assert.equal(response.statusCode, 200, `GET ${url} ${response.statusMessage}`);
        const auth = JSON.parse(response.body) as Auth;
        const accessToken = auth.accessToken;
        assert.isTrue(accessToken!=="");
        assert.isTrue(auth.userName===TestLocalMongoDbUser);
        assert.isTrue(auth.dbName===TestLocalMongoDbName);
        assert.isTrue(auth.dbProvider!=="");

        url = QueryController.RouteBeginning + "mongo/entites";
        response = await service.Server.injectGET(url, accessToken);
        assert.equal(response.statusCode, 200, `GET ${url} ${response.statusMessage}`);
        const collections = JSON.parse(response.body);
        const collectionName = collections[0];

        url = QueryController.RouteBeginning + "mongo/entites"
            + "?from=" + encodeURIComponent(collectionName)
            + "&what=" + encodeURIComponent("{}");
        response = await service.Server.injectGET(url, accessToken);
        assert.equal(response.statusCode, 200, `GET ${url} ${response.statusMessage}`);

    }
    finally {
        service.dispose();
    }
}