import { describe,it } from "mocha";
import TestStubDb from "./TestStubDb";
import TestService from "../../../serviceMongodb/src/Tests/TestService";

describe("Tests", () => {

    describe("Unit tests", () => {
        it(`Test StubDb `,     TestStubDb);
    });

});
