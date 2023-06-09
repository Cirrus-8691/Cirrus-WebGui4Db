import DbDocument from "../Domain/DbDocument";
import { QueryDeleteParameters, QueryDocumentParameters, QueryFindParameters } from "../Domain/QueryParameters";
import ApiGateway from "./ApiGateway";
import { Auth } from "./Auth";

export async function RunQueryFind(parameters: QueryFindParameters, auth: Auth): Promise<DbDocument[]> {
    const apiGateway = new ApiGateway();
    return await apiGateway.getAsync<DbDocument[]>(
        "api/v1/mongo/documents"
        + "?collection=" + encodeURIComponent(parameters.collection)
        + "&what=" + encodeURIComponent(parameters.what)
        + "&skip=" + parameters.skip
        + "&limit=" + parameters.limit,
        auth.accessToken);
}

export async function RunQueryDelete(parameters: QueryDeleteParameters, auth: Auth): Promise<boolean> {
    const apiGateway = new ApiGateway();
    return await apiGateway.deleteAsync<boolean>(
        "api/v1/mongo/document"
        + "?collection=" + encodeURIComponent(parameters.collection)
        + "&_id=" + encodeURIComponent(parameters._id),
        auth.accessToken);
}

export async function RunQueryInsert(parameters: QueryDocumentParameters, auth: Auth): Promise<boolean> {
    const apiGateway = new ApiGateway();
    return await apiGateway.putAsync<boolean>(
        "api/v1/mongo/document"
        + "?collection=" + encodeURIComponent(parameters.collection),
        parameters.document,
        auth.accessToken);
}

export async function RunQueryUpdate(parameters: QueryDocumentParameters, auth: Auth): Promise<boolean> {
    const apiGateway = new ApiGateway();
    return await apiGateway.postAsync<boolean>(
        "api/v1/mongo/document"
        + "?collection=" + encodeURIComponent(parameters.collection)
        + "&_id=" + encodeURIComponent(parameters.document._id),
        parameters.document,
        auth.accessToken);
}