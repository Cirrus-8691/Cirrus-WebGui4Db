import { assert } from "chai";
import Service from "../serviceGenericDatabase/Service";
import QueryController from "../serviceGenericDatabase/Controller/QueryController";
import { Auth } from "../serviceMongodb/Domain/JwToken";
import StubDatabase from "../serviceGenericDatabase/Model/StubDatabase";
import HttpFastifyServer from "../serviceGenericDatabase/HttpFastifyServer";
import Database from "../serviceGenericDatabase/Model/Database";
import PostgreSqlQueryController from "../servicePostgreSql/Controller/PostgreSqlQueryController";
import { TestLocalPostgreDbName, TestLocalPostgreDbUrl, TestLocalPostgreDbUser } from "./TestPostgreSql";

export const TestServiceUrl = "http://localhost:3000/";

export default async function TestServicePostgre(): Promise<void> {

    const service = new Service(
        new URL(TestServiceUrl),
        false,
        new StubDatabase(),
        (server: HttpFastifyServer, db: Database) => (new PostgreSqlQueryController(server, db)));
    try {
        let url = QueryController.RouteBeginning + "postgre/connection/test"
            + "?url=" + encodeURIComponent(TestLocalPostgreDbUrl);
        let response = await service.Server.injectGET(url);
        assert.equal(response.statusCode, 200, `GET ${url} ${response.statusMessage}`);

        url = QueryController.RouteBeginning + "postgre/connection/auth"
            + "?url=" + encodeURIComponent(TestLocalPostgreDbUrl);
        response = await service.Server.injectGET(url);
        assert.equal(response.statusCode, 200, `GET ${url} ${response.statusMessage}`);
        const auth = JSON.parse(response.body) as Auth;
        const accessToken = auth.accessToken;
        assert.isTrue(accessToken !== "");
        assert.isTrue(auth.userName === TestLocalPostgreDbUser);
        assert.isTrue(auth.dbName === TestLocalPostgreDbName);
        assert.isTrue(auth.dbProvider !== "");

        url = QueryController.RouteBeginning + "postgre/repositories";
        response = await service.Server.injectGET(url, accessToken);
        assert.equal(response.statusCode, 200, `GET ${url} ${response.statusMessage}`);
        const collections = JSON.parse(response.body);
        const collectionName = collections[0];

        url = QueryController.RouteBeginning + "postgre/entities"
            + "?from=" + encodeURIComponent(collectionName)
            + "&what=" + encodeURIComponent("{}");
        response = await service.Server.injectGET(url, accessToken);
        assert.equal(response.statusCode, 200, `GET ${url} ${response.statusMessage}`);

    }
    finally {
        service.dispose();
    }
}