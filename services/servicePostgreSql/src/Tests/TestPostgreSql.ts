import { assert } from "chai";
import PostgreSqlDatabase from "../Model/PostgreSqlDatabase";

export const TestLocalPostgreDbUser = "usr";
export const TestLocalPostgreDbName = "Histo";
export const TestLocalPostgreDbUrl = `"Host=192.168.0.30;Database=${TestLocalPostgreDbName};Username=${TestLocalPostgreDbUser};Password=Pwd*175`;

export default async function TestPostgreSqlDb() {
    const db = new PostgreSqlDatabase();

    const connectString = TestLocalPostgreDbUrl;
    db.connect(connectString, TestLocalPostgreDbName);
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