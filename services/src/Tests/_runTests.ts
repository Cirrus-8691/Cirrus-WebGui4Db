import { describe, it } from "mocha";
import TestServiceMongo from "./TestServiceMongo";
import TestStubDb from "./TestStubDb";
import TestServicePostgre from "./TestServicePostgre";

//import TestPostgreSql from "./TestPostgreSql";
//import TestMongoDb from "./TestMongoDb";

describe("Tests", () => {

    describe("Unit tests (Db is stubed)", () => {
        it(`Test StubDb `, TestStubDb);
        it(`Test Service Mongo`, TestServiceMongo);
        it(`Test Service postgre`, TestServicePostgre);
    });

    // describe("Integrations tests (Db hosted on 192.168.0.24) ", () => {
    //     it(`Test MongoDb `, TestMongoDb);
    //     it(`Test PostgreSql `, TestPostgreSql);
    // });

});
