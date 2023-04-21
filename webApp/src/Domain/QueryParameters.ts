import DbDocument from "./DbDocument"

export interface QueryFindParameters
{
    collection: string,
    what: string,
    skip : number,
    limit : number
}

export interface QueryDeleteParameters
{
    collection: string,
    _id: string,
}

export interface QueryDocumentParameters
{
    collection: string,
    document: DbDocument,
}
