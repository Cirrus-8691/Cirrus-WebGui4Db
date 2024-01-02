import DbEntity from "../Domain/DbEntity";
import { QueryDeleteParameters, QueryDocumentParameters, QueryFindParameters } from "../Domain/QueryParameters";
import ApiGateway from "./ApiGateway";
import { Auth } from "./Auth";

export async function RunQueryFind(service: string, parameters: QueryFindParameters, auth: Auth): Promise<DbEntity[]> {
    const apiGateway = new ApiGateway();
    return await apiGateway.getAsync<DbEntity[]>(
        `api/v1/${service}/entities`
        + "?repository=" + encodeURIComponent(parameters.repository)
        + "&what=" + encodeURIComponent(parameters.what)
        + "&skip=" + parameters.skip
        + "&limit=" + parameters.limit,
        auth.accessToken);
}

export async function RunQueryDelete(service: string, parameters: QueryDeleteParameters, auth: Auth): Promise<boolean> {
    const apiGateway = new ApiGateway();
    return await apiGateway.deleteAsync<boolean>(
        `api/v1/${service}/entity`
        + "?repository=" + encodeURIComponent(parameters.collection)
        + "&_id=" + encodeURIComponent(parameters._id),
        auth.accessToken);
}

export async function RunQueryInsert(service: string, parameters: QueryDocumentParameters, auth: Auth): Promise<boolean> {
    const apiGateway = new ApiGateway();
    return await apiGateway.putAsync<boolean>(
        `api/v1/${service}/entity`
        + "?repository=" + encodeURIComponent(parameters.repository),
        parameters.entity,
        auth.accessToken);
}

export async function RunQueryUpdate(service: string, parameters: QueryDocumentParameters, auth: Auth): Promise<boolean> {
    const apiGateway = new ApiGateway();
    return await apiGateway.postAsync<boolean>(
        `api/v1/${service}/entity`
        + "?repository=" + encodeURIComponent(parameters.repository),
       // + "&_id=" + encodeURIComponent(parameters.entity._id),
        { entity: parameters.entity },
        auth.accessToken);
}