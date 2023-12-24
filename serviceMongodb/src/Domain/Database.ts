import DbEntity from "./DbEntity";
import { QueryEntityParameters, QueryFindParameters } from "./QueryParameters";

export default interface Database {

    connect(url: URL): void;

    test(): Promise<void>;

    getRepositories(): Promise<string[]>;

    findOnRepository(parameters : QueryFindParameters): Promise<DbEntity[]>;

    insertEntity(parameters: QueryEntityParameters, doc : DbEntity): Promise<boolean>;

    updateEntity(parameters: QueryEntityParameters, doc : DbEntity): Promise<boolean>;
    
    deleteEntity(parameters: QueryEntityParameters): Promise<boolean>;

    dispose(): void;
}