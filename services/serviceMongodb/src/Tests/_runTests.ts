import { describe,it } from "mocha";
import TestStubDb from "./TestStubDb";
import TestMongoDb from "./TestMongoDb";
import TestService from "./TestService";

describe("Tests", () => {

    describe("Unit tests", () => {
        it(`Test StubDb `,     TestStubDb);
        it(`Test MongoDb `,    TestMongoDb);
        it(`Test Service `,    TestService);
    });

});
