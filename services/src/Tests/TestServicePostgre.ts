import { assert } from "chai";
import { TestLocalPostgreDbName, TestLocalPostgreDbUrl, TestLocalPostgreDbUser } from "./TestPostgreSql";
import Service from "../GenericServiceDatabase/Service";
import HttpFastifyServer from "../GenericServiceDatabase/HttpFastifyServer";
import Database from "../GenericServiceDatabase/Model/Database";
import QueryController from "../Gateway/Controller/QueryController";
import { Auth } from "../ServicePostgreSql/Domain/JwToken";
import StubDatabase from "../GenericServiceDatabase/Model/StubDatabase";
import PostgreController from "../ServicePostgreSql/Controller/PostgreSqlController";

export const TestServiceUrl = "http://localhost:3000/";

export default async function TestServicePostgre(): Promise<void> {

    const service = new Service({
        name: "postgresql",
        url: new URL(TestServiceUrl),
        logger: false,
        db: new StubDatabase()
    },
        (server: HttpFastifyServer, db: Database) => (new PostgreController(server, db)));
    try {
        let url = QueryController.RouteBeginning + "connection/test"
            + "?url=" + encodeURIComponent(TestLocalPostgreDbUrl);
        let response = await service.server.injectGET(url);
        assert.equal(response.statusCode, 200, `GET ${url} ${response.statusMessage}`);

        url = QueryController.RouteBeginning + "connection/auth"
            + "?url=" + encodeURIComponent(TestLocalPostgreDbUrl);
        response = await service.server.injectGET(url);
        assert.equal(response.statusCode, 200, `GET ${url} ${response.statusMessage}`);
        const auth = JSON.parse(response.body) as Auth;
        const accessToken = auth.accessToken;
        assert.isTrue(accessToken !== "");
        assert.isTrue(auth.userName === TestLocalPostgreDbUser);
        assert.isTrue(auth.dbName === TestLocalPostgreDbName);
        assert.isTrue(auth.dbProvider !== "");

        url = QueryController.RouteBeginning + "repositories";
        response = await service.server.injectGET(url, accessToken);
        assert.equal(response.statusCode, 200, `GET ${url} ${response.statusMessage}`);
        const collections = JSON.parse(response.body);
        const collectionName = collections[0];

        url = QueryController.RouteBeginning + "entities"
            + "?from=" + encodeURIComponent(collectionName)
            + "&what=" + encodeURIComponent("{}");
        response = await service.server.injectGET(url, accessToken);
        assert.equal(response.statusCode, 200, `GET ${url} ${response.statusMessage}`);

    }
    finally {
        service.dispose();
    }
}