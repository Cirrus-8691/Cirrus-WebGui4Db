import DbEntity from "../Model/DbEntity";

export interface QueryFindParameters
{
    collection: string,
    what: string,
    skip : string,
    limit : string
}
export interface QueryEntityParameters
{
    collection: string,
    _id?: string,
}

export interface BodyEntityParameters
{
    document: DbEntity,
}
