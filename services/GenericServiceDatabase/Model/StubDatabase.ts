import Database from "./Database";
import DbEntity from "./DbEntity";
import { QueryFindParameters, QueryEntityParameters, BodyEntityParameters } from "../Domain/QueryParameters";
import DbConnect from "./DbConnect";

export default class StubDatabase implements Database {

    static Repository1Name = "Repository-1";
    static Entity1 = {
        id: "001-aaa",
        retailerId: "abc"
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async connect(dbConnect: DbConnect): Promise<void> {
        // nothing todo
    }

    async test(): Promise<void> {
        // nothing todo
    }

    async getRepositories(): Promise<string[]> {
        return [
            StubDatabase.Repository1Name,
            "Repository-2"
        ];
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async findOnRepository(parameters: QueryFindParameters): Promise<DbEntity[]> {
        return [
            StubDatabase.Entity1,
            {
                id: "002-bbb",
                retailerId: "xyz"
            }];
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async insertEntity(parameters: QueryEntityParameters, doc : BodyEntityParameters): Promise<boolean> {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async updateEntity(parameters: QueryEntityParameters, doc : BodyEntityParameters): Promise<boolean> {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async deleteEntity(parameters: QueryEntityParameters): Promise<boolean> {
        return true;
    }

    dispose(): void {
        // nothing todo
    }

}