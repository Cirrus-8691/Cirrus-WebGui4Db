import DbEntity from "./DbEntity"

export interface QueryFindParameters
{
    repository: string,
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
    repository: string,
    entity: DbEntity,
}
