import { assert } from "chai";

import MongoDatabase from "../serviceMongodb/Model/MongoDatabase";
import MongoDbConnect from "../serviceMongodb/Model/MongoDbConnect";

export const TestLocalMongoDbUser = "usr";
export const TestLocalMongoDbName = "Histo";
export const TestLocalMongoDbUrl = `mongodb://${TestLocalMongoDbUser}:Flin*123@192.168.232.133:27017/${TestLocalMongoDbName}`;

export default async function TestMongoDb() {
    const db = new MongoDatabase();

    const dbConnect = new MongoDbConnect(TestLocalMongoDbUrl);
    db.connect(dbConnect);
    await db.test();

    const collections = await db.getRepositories();
    assert.isTrue(collections.length > 0);

    let documents = await db.findOnRepository(
        {
            collection: collections[0],
            what: "{}",
            skip: "0",
            limit: "10"
        });
    assert.isDefined(documents);

    const docWorld = { Hello: "World" };
    const findWorld = JSON.stringify(docWorld);
    let ok = await db.insertEntity(
        { collection: collections[0] },
        { document: docWorld }
    );
    assert.isTrue(ok);

    documents = await db.findOnRepository({
        collection: collections[0],
        what: findWorld,
        skip: "0",
        limit: "1"
    });
    assert.isNotEmpty(documents);
    assert.equal(1, documents.length);
    assert.equal(docWorld.Hello, documents[0].Hello);

    const docXyz= { Hello: "Xyz" };
    const findXyz = JSON.stringify(docXyz);
    ok = await db.updateEntity(
        {
            collection: collections[0],
            _id: documents[0]._id
        },
        {
            document: docXyz
        });
    assert.isTrue(ok);

    documents = await db.findOnRepository({
        collection: collections[0],
        what: findXyz,
        skip: "0",
        limit: "1"
    });
    assert.isNotEmpty(documents);
    assert.equal(1, documents.length);
    assert.equal(docXyz.Hello, documents[0].Hello);

    ok = await db.deleteEntity({
        collection: collections[0],
        _id: documents[0]._id
    });
    assert.isTrue(ok);

    documents = await db.findOnRepository({
        collection: collections[0],
        what: findXyz,
        skip: "0",
        limit: "1"
    });
    assert.isEmpty(documents);
    assert.equal(0, documents.length);

    db.dispose();
}