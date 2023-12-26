import { describe,it } from "mocha";
import TestMongoDb from "./TestMongoDb";
import TestServiceMongo from "./TestServiceMongo";
import TestStubDb from "./TestStubDb";
//import TestPostgreSql from "./TestPostgreSql";

describe("Tests", () => {

    describe("Unit tests", () => {
        it(`Test StubDb `,     TestStubDb);
        it(`Test Service `,    TestServiceMongo);
        //it(`Test MongoDb `,    TestMongoDb);
        //it(`Test Service `,    TestServicePostgreSql);
     //  it(`Test PostgreSql `,    TestPostgreSql);
    });

});
