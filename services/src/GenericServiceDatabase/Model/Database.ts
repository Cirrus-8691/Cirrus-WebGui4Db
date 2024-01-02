import DbEntity from "./DbEntity";
import { QueryEntityParameters, QueryFindParameters } from "../Domain/QueryParameters";
import DbConnect from "./DbConnect";

export interface Repository {
    name: string;
    primaryKey: string;
}

export default interface Database {

    connect(dbConnect: DbConnect): Promise<void>;

    test(): Promise<void>;

    getRepositories(): Promise<Repository[]>;

    findOnRepository(parameters : QueryFindParameters): Promise<DbEntity[]>;

    insertEntity(parameters: QueryEntityParameters, doc : DbEntity): Promise<boolean>;

    updateEntity(parameters: QueryEntityParameters, doc : DbEntity): Promise<boolean>;
    
    deleteEntity(parameters: QueryEntityParameters): Promise<boolean>;

    dispose(): void;
}