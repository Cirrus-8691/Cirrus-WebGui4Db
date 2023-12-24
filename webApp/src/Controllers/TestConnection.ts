import { DbUrl } from "../Domain/DbUrl";
import ApiGateway from "./ApiGateway";
import { Auth } from "./Auth";

export default async function TestConnection(newUrl: DbUrl) {
    const apiGateway = new ApiGateway();
    await apiGateway.getAsync(
        `api/v1/${newUrl.service()}/connection/test?url=${encodeURIComponent(newUrl.toString())}`);
}

export async function ValidateConnection(newUrl: DbUrl, setAuth: (value: Auth) => void): Promise<string[]> {
    const apiGateway = new ApiGateway();
    const auth = await apiGateway.getAsync<Auth>(
        `api/v1/${newUrl.service()}/connection/auth?url=${encodeURIComponent(newUrl.toString())}`);

    const repositoryNames = await apiGateway.getAsync<string[]>(
        `api/v1/${newUrl.service()}/repositories`,
        auth.accessToken);

    setAuth(auth);
    return repositoryNames;
}