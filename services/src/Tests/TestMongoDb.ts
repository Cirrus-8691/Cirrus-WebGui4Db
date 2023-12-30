import { assert } from "chai";
import MongoDatabase from "../ServiceMongodb/Model/MongoDatabase";
import MongoDbConnect from "../ServiceMongodb/Model/MongoDbConnect";

export const TestLocalMongoDbUser = "usr";
export const TestLocalMongoDbName = "fred";
export const TestLocalMongoDbUrl = `mongodb://${TestLocalMongoDbUser}:Pwd*175@192.168.0.24:27017/${TestLocalMongoDbName}`;

export default async function TestMongoDb() {
    const db = new MongoDatabase();
    try {

        const dbConnect = new MongoDbConnect(TestLocalMongoDbUrl);
        db.connect(dbConnect);
        await db.test();

        const collections = await db.getRepositories();
        assert.isTrue(collections.length > 0, "collections.length > 0");

        let documents = await db.findOnRepository(
            {
                repository: collections[0],
                what: "{}",
                skip: 0,
                limit: 10
            });
        assert.isDefined(documents, "documents Defined");

        const docWorld = { Hello: "World" };
        const findWorld = JSON.stringify(docWorld);
        let ok = await db.insertEntity(
            { collection: collections[0] },
            docWorld
        );
        assert.isTrue(ok, "insertEntity OK");

        documents = await db.findOnRepository({
            repository: collections[0],
            what: findWorld,
            skip: 0,
            limit: 1
        });
        assert.isNotEmpty(documents, "insertEntity findOnRepository ");
        assert.equal(1, documents.length);
        assert.equal(docWorld.Hello, documents[0].Hello);

        const docXyz = {
            _id: documents[0]._id,
            Hello: "Xyz"
        };
        const findXyz = JSON.stringify(docXyz);
        ok = await db.updateEntity(
            {
                collection: collections[0]
            },
            docXyz);
        assert.isTrue(ok, "updateEntity Ok");

        documents = await db.findOnRepository({
            repository: collections[0],
            what: JSON.stringify({ Hello: docXyz.Hello }),
            skip: 0,
            limit: 1
        });
        assert.isNotEmpty(documents, "updateEntity findOnRepository ");
        assert.equal(1, documents.length);
        assert.equal(docXyz.Hello, documents[0].Hello);

        ok = await db.deleteEntity({
            collection: collections[0],
            _id: documents[0]._id
        });
        assert.isTrue(ok, "deleteEntity OK");

        documents = await db.findOnRepository({
            repository: collections[0],
            what: findXyz,
            skip: 0,
            limit: 1
        });
        assert.isEmpty(documents, "deleteEntity findOnRepository ");
        assert.equal(0, documents.length);

    }
    finally {
        db.dispose();
    }
}