import { describe,it } from "mocha";
import TestService from "./TestService";
import TestStubDb from "./TestStubDb";
import TestMongoDb from "./TestMongoDb";

describe("Tests", () => {

    describe("Unit tests", () => {
        it(`Test StubDb `,     TestStubDb);
        it(`Test MongoDb `,    TestMongoDb);
        it(`Test Service `,    TestService);
    });

});
