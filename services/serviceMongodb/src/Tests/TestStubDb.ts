import { assert } from "chai";
import StubDatabase from "../Domain/StubDatabase";
import { TestLocalMongoDbUrl } from "./TestMongoDb";

export default async function TestStubDb() {
    const stubDb = new StubDatabase();
    
    const url = TestLocalMongoDbUrl;
    stubDb.connect(new URL(url));
    await stubDb.test();

    const collections = await stubDb.getRepositories();
    assert.equal(collections[0], StubDatabase.Repository1Name);

    const document = await stubDb.findOnRepository(
        {
            collection: "",
            what: "",
            skip : "0",
            limit : "10"
        });
    assert.isTrue(document.length>0);
    assert.equal(document[0].id, StubDatabase.Entity1.id);
    assert.equal(document[0].retailerId, StubDatabase.Entity1.retailerId);

    stubDb.dispose();
}