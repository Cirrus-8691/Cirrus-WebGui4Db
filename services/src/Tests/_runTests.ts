import { describe, it } from "mocha";
import TestMongoDb from "./TestMongoDb";
import TestServiceMongo from "./TestServiceMongo";
import TestStubDb from "./TestStubDb";
import TestServicePostgre from "./TestServicePostgre";
import TestPostgreSql from "./TestPostgreSql";

describe("Tests", () => {

    describe("Unit tests", () => {
        it(`Test StubDb `, TestStubDb);
        it(`Test Service Mongo`, TestServiceMongo);
        it(`Test MongoDb `, TestMongoDb);
        it(`Test Service ostgre`, TestServicePostgre);
        it(`Test PostgreSql `, TestPostgreSql);
    });

});
