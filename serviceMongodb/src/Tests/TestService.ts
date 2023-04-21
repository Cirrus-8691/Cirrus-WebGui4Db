import { assert } from "chai";
import QueryController from "../Controller/QueryController";
import Service from "../Service";
import StubDatabase from "./StubDatabase";
import { TestLocalMongoDbName, TestLocalMongoDbUrl, TestLocalMongoDbUser } from "./TestMongoDb";
import { Auth } from "../Domain/JwToken";


export const TestServiceUrl = "http://localhost:3000/";

export default async function TestService(): Promise<void> {

    const service = new Service(new URL(TestServiceUrl), false, new StubDatabase());
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

        url = QueryController.RouteBeginning + "mongo/collections";
        response = await service.Server.injectGET(url, accessToken);
        assert.equal(response.statusCode, 200, `GET ${url} ${response.statusMessage}`);
        const collections = JSON.parse(response.body);
        const collectionName = collections[0];

        url = QueryController.RouteBeginning + "mongo/documents"
            + "?from=" + encodeURIComponent(collectionName)
            + "&what=" + encodeURIComponent("{}");
        response = await service.Server.injectGET(url, accessToken);
        assert.equal(response.statusCode, 200, `GET ${url} ${response.statusMessage}`);

    }
    finally {
        service.dispose();
    }
}