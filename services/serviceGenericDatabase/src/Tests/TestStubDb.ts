import { assert } from "chai";
import StubDatabase from "../Model/StubDatabase";

export default async function TestStubDb() {
    const stubDb = new StubDatabase();

    const url = `mongodb://usr:Flin*123@192.168.232.133:27017/Histo`;
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