import Database from "../Domain/Database";
import DbDocument from "../Domain/DbDocument";
import { QueryFindParameters, QueryDocumentParameters, BodyDocumentParameters } from "../Domain/QueryParameters";

export default class StubDatabase implements Database {

    static Collection1Name = "Collection-1";
    static Document1 = {
        id: "001-aaa",
        retailerId: "abc"
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    connect(url: URL): void {
        // nothing todo
    }

    async test(): Promise<void> {
        // nothing todo
    }

    async getCollections(): Promise<string[]> {
        return [
            StubDatabase.Collection1Name,
            "Collection-2"
        ];
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async findOnCollection(parameters: QueryFindParameters): Promise<DbDocument[]> {
        return [
            StubDatabase.Document1,
            {
                id: "002-bbb",
                retailerId: "xyz"
            }];
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async insertDocument(parameters: QueryDocumentParameters, doc : BodyDocumentParameters): Promise<boolean> {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async updateDocument(parameters: QueryDocumentParameters, doc : BodyDocumentParameters): Promise<boolean> {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async deleteDocument(parameters: QueryDocumentParameters): Promise<boolean> {
        return true;
    }

    dispose(): void {
        // nothing todo
    }

}