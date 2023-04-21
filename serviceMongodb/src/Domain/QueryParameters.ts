import DbDocument from "./DbDocument";

export interface QueryFindParameters
{
    collection: string,
    what: string,
    skip : string,
    limit : string
}
export interface QueryDocumentParameters
{
    collection: string,
    _id?: string,
}

export interface BodyDocumentParameters
{
    document: DbDocument,
}
