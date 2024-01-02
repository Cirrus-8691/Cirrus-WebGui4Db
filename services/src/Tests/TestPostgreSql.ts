import { assert } from "chai";
import PostgreSqlDatabase from "../ServicePostgreSql/Model/PostgreSqlDatabase";
import PostgreSqlConnect from "../ServicePostgreSql/Model/PostgreSqlConnect";

export const TestLocalPostgreDbUser = "usr";
export const TestLocalPostgreDbName = "fred-24";
export const TestLocalPostgreDbUrl = `Host=192.168.0.24;Port=5432;Database=${TestLocalPostgreDbName};Username=${TestLocalPostgreDbUser};Password=Pwd*175`;

export default async function TestPostgreSql() {
    const db = new PostgreSqlDatabase();
    try {
        const dbConnect = new PostgreSqlConnect(TestLocalPostgreDbUrl);
        db.connect(dbConnect);
        await db.test();

        const tables = await db.getRepositories();
        assert.isTrue(tables.length > 0);

        const entityUser = { Id: "World", Secret: "abc", Profil: "User", Authentication: "password" };
        const findUser = `"Id"='${entityUser.Id}'`;

        let entities = await db.findOnRepository(
            {
                repository: tables[1].name,
                what: findUser,
                skip: 0,
                limit: 10
            });
        assert.isEmpty(entities);

        let ok = await db.insertEntity(
            { repository: tables[1].name },
            { entity: entityUser }
        );
        assert.isTrue(ok);

        entities = await db.findOnRepository({
            repository: tables[1].name,
            what: findUser,
            skip: 0,
            limit: 1
        });
        assert.isNotEmpty(entities);
        assert.equal(1, entities.length);
        assert.equal(entityUser.Id, entities[0].Id);

        const docXyz = { Id: "World", Secret: "123" };
        ok = await db.updateEntity(
            {
                repository: tables[1].name,
            },
            { entity: docXyz });
        assert.isTrue(ok);

        entities = await db.findOnRepository({
            repository: tables[1].name,
            what: findUser,
            skip: 0,
            limit: 1
        });
        assert.isNotEmpty(entities);
        assert.equal(1, entities.length);
        assert.equal(docXyz.Secret, entities[0].Secret);

        ok = await db.deleteEntity({
            repository: tables[1].name,
            _id: entityUser.Id
        });
        assert.isTrue(ok);

        entities = await db.findOnRepository({
            repository: tables[1].name,
            what: findUser,
            skip: 0,
            limit: 1
        });
        assert.isEmpty(entities);
        assert.equal(0, entities.length);

    }
    finally {
        db.dispose();
    }
}