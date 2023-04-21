import { Collection, Filter, FindOptions, MongoClient, ObjectId } from "mongodb";
import Database from "./Database";
import DbDocument from "./DbDocument";
import { QueryFindParameters, BodyDocumentParameters, QueryDocumentParameters } from "./QueryParameters";

export default class MongoDatabase implements Database {

    private client: MongoClient | undefined = undefined;
    private dbName = "";

    connect(url: URL): void {
        this.client = new MongoClient(url.toString() + "?authMechanism=DEFAULT");
        this.dbName = url.pathname.replace("/", "");
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

    async getCollections(): Promise<string[]> {
        if (this.client) {
            const db = this.client.db(this.dbName);
            const collections = await db.collections();
            return collections.map(c => c.collectionName);
        }
        else {
            throw new Error("Undefined MongoClient URL")
        }
    }

    private getCollection(collection: string): Collection<DbDocument> {
        if (this.client) {
            const db = this.client.db(this.dbName);
            return db.collection(collection);
        }
        else {
            throw new Error("Undefined MongoClient URL")
        }
    }

    async findOnCollection(parameters: QueryFindParameters): Promise<DbDocument[]> {
        const collection = this.getCollection(parameters.collection);
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

    async insertDocument(parameters: QueryDocumentParameters, doc: DbDocument): Promise<boolean> {
        const collection = this.getCollection(parameters.collection);
        const result = await collection.insertOne(doc as DbDocument);
        return result.acknowledged;
    }

    async updateDocument(parameters: QueryDocumentParameters, doc: DbDocument): Promise<boolean> {
        const collection = this.getCollection(parameters.collection);
        const { _id, ...newDoc } = doc;
        const filter: Filter<DbDocument> = {
            _id: new ObjectId(_id)
        };
        const update = { $set: newDoc };
        const result = await collection.updateOne(filter, update);
        return result.acknowledged && result.modifiedCount === 1;
    }

    async deleteDocument(parameters: QueryDocumentParameters): Promise<boolean> {
        const collection = this.getCollection(parameters.collection);
        const filter: Filter<DbDocument> = {
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