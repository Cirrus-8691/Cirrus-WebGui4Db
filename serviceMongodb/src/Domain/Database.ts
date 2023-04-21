import DbDocument from "./DbDocument";
import { QueryDocumentParameters, QueryFindParameters } from "./QueryParameters";

export default interface Database {

    connect(url: URL): void;

    test(): Promise<void>;

    getCollections(): Promise<string[]>;

    findOnCollection(parameters : QueryFindParameters): Promise<DbDocument[]>;

    insertDocument(parameters: QueryDocumentParameters, doc : DbDocument): Promise<boolean>;

    updateDocument(parameters: QueryDocumentParameters, doc : DbDocument): Promise<boolean>;
    
    deleteDocument(parameters: QueryDocumentParameters): Promise<boolean>;

    dispose(): void;
}