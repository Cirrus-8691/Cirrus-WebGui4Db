import { Collection, Filter, FindOptions, MongoClient, ObjectId } from "mongodb";
import { QueryEntityParameters, QueryFindParameters } from "../../serviceGenericDatabase/Domain/QueryParameters";
import Database from "../../serviceGenericDatabase/Model/Database";
import DbEntity from "../../serviceGenericDatabase/Model/DbEntity";
import DbConnect from "../../serviceGenericDatabase/Model/DbConnect";

export default class MongoDatabase implements Database {

    private client: MongoClient | undefined = undefined;
    private dbName = "";

    connect(dbConnect: DbConnect): void {
        this.client = new MongoClient(dbConnect.toString() + "?authMechanism=DEFAULT");
        this.dbName = dbConnect.database;
    }

    async test(): Promise<void> {
        if (this.client) {
            const db = this.client.db(this.dbName);
            await db.command({ ping: 1 });
        }
        else {
            throw new Error("Undefined MongoClient URL")
        }
    }

    async getRepositories(): Promise<string[]> {
        if (this.client) {
            const db = this.client.db(this.dbName);
            const collections = await db.collections();
            return collections.map(c => c.collectionName);
        }
        else {
            throw new Error("Undefined MongoClient URL")
        }
    }

    private getRepository(collection: string): Collection<DbEntity> {
        if (this.client) {
            const db = this.client.db(this.dbName);
            return db.collection(collection);
        }
        else {
            throw new Error("Undefined MongoClient URL")
        }
    }

    async findOnRepository(parameters: QueryFindParameters): Promise<DbEntity[]> {
        const collection = this.getRepository(parameters.collection);
        const filter = JSON.parse(parameters.what);
        let options: FindOptions | undefined = undefined;
        if (parameters.limit && parameters.skip) {
            options = {
                limit: +parameters.limit,
                skip: +parameters.skip
            };
        }
        else if (parameters.limit) {
            options = {
                limit: +parameters.limit
            };
        }
        else if (parameters.skip) {
            options = {
                skip: +parameters.skip
            };
        }
        return await collection.find(filter, options).toArray();
    }

    async insertEntity(parameters: QueryEntityParameters, doc: DbEntity): Promise<boolean> {
        const collection = this.getRepository(parameters.collection);
        const result = await collection.insertOne(doc as DbEntity);
        return result.acknowledged;
    }

    async updateEntity(parameters: QueryEntityParameters, doc: DbEntity): Promise<boolean> {
        const collection = this.getRepository(parameters.collection);
        const { _id, ...newDoc } = doc;
        const filter: Filter<DbEntity> = {
            _id: new ObjectId(_id)
        };
        const update = { $set: newDoc };
        const result = await collection.updateOne(filter, update);
        return result.acknowledged && result.modifiedCount === 1;
    }

    async deleteEntity(parameters: QueryEntityParameters): Promise<boolean> {
        const collection = this.getRepository(parameters.collection);
        const filter: Filter<DbEntity> = {
            _id: new ObjectId(parameters._id)
        };
        const result = await collection.deleteOne(filter);
        return result.acknowledged && result.deletedCount === 1;
    }

    dispose(): void {
        if (this.client) {
            this.client.close();
        }
    }
}