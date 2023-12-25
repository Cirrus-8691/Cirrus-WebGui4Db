import { describe,it } from "mocha";
import TestMongoDb from "./TestPostgreSql";

describe("Tests", () => {

    describe("Unit tests", () => {
        it(`Test MongoDb `,    TestMongoDb);
    });

});
