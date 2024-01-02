import { DbConnect } from "../Domain/DbConnect";
import ApiGateway from "./ApiGateway";
import { Auth } from "./Auth";

export interface Repository {
    name: string;
    primaryKey: string;
}
export const EmptyRepository : Repository = {
    name: "",
    primaryKey: ""
}

export default async function TestConnection(newUrl: DbConnect) {
    const apiGateway = new ApiGateway();
    await apiGateway.getAsync(
        `api/v1/${newUrl.service()}/connection/test?url=${encodeURIComponent(newUrl.toString())}`);
}

export async function ValidateConnection(newUrl: DbConnect, setAuth: (value: Auth) => void): Promise<Repository[]> {
    const apiGateway = new ApiGateway();
    const auth = await apiGateway.getAsync<Auth>(
        `api/v1/${newUrl.service()}/connection/auth?url=${encodeURIComponent(newUrl.toString())}`);

    const repositoryNames = await apiGateway.getAsync<Repository[]>(
        `api/v1/${newUrl.service()}/repositories`,
        auth.accessToken);

    setAuth(auth);
    return repositoryNames;
}