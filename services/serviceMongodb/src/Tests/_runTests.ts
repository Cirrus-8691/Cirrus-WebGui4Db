import { describe,it } from "mocha";
import TestMongoDb from "./TestMongoDb";
import TestService from "./TestService";

describe("Tests", () => {

    describe("Unit tests", () => {
        it(`Test MongoDb `,    TestMongoDb);
        it(`Test Service `,    TestService);
    });

});
