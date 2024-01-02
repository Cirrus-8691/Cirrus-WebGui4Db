import { Collection, Filter, FindOptions, MongoClient, ObjectId } from "mongodb";
import Database, { Repository } from "../../GenericServiceDatabase/Model/Database";
import DbConnect from "../../GenericServiceDatabase/Model/DbConnect";
import DbEntity from "../../GenericServiceDatabase/Model/DbEntity";
import { QueryEntityParameters, QueryFindParameters } from "../../GenericServiceDatabase/Domain/QueryParameters";

export default class MongoDatabase implements Database {

    private client: MongoClient | undefined = undefined;
    private dbName = "";

    async connect(dbConnect: DbConnect):  Promise<void> {
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

    async getRepositories(): Promise<Repository[]> {
        if (this.client) {
            const db = this.client.db(this.dbName);
            const collections = await db.collections();
            return collections.map<Repository>(c => ({
                name : c.collectionName,
                primaryKey: "_id"
            }));
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
        const collection = this.getRepository(parameters.repository);
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

    async insertEntity(parameters: QueryEntityParameters, payload:{ entity: DbEntity}): Promise<boolean> {
        const collection = this.getRepository(parameters.repository);
        const result = await collection.insertOne(payload.entity);
        return result.acknowledged;
    }

    async updateEntity(parameters: QueryEntityParameters, payload:{ entity: DbEntity}): Promise<boolean> {
        const collection = this.getRepository(parameters.repository);
        const { _id, ...newDoc } = payload.entity;
        const filter: Filter<DbEntity> = {
            _id: new ObjectId(_id)
        };
        const update = { $set: newDoc };
        const result = await collection.updateOne(filter, update);
        return result.acknowledged && result.modifiedCount === 1;
    }

    async deleteEntity(parameters: QueryEntityParameters): Promise<boolean> {
        const collection = this.getRepository(parameters.repository);
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