import DbEntity from "../Model/DbEntity";

export interface QueryFindParameters
{
    repository: string,
    what: string,
    skip : number,
    limit : number
}
export interface QueryEntityParameters
{
    repository: string,
    _id?: string,
}

export interface BodyEntityParameters
{
    entity: DbEntity,
}
