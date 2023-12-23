import MongoDbUrl from "../Domain/DbUrl/MongoDbUrl";
import ApiGateway from "./ApiGateway";
import { Auth } from "./Auth";

export default async function TestConnection(newUrl: MongoDbUrl) {
    const apiGateway = new ApiGateway();
    await apiGateway.getAsync(
        `api/v1/mongo/connection/test?url=${encodeURIComponent(newUrl.toString())}`);
}

export async function ValidateConnection(newUrl: MongoDbUrl, setAuth: (value: Auth) => void): Promise<string[]> {
    const apiGateway = new ApiGateway();
    const auth = await apiGateway.getAsync<Auth>(
        `api/v1/mongo/connection/auth?url=${encodeURIComponent(newUrl.toString())}`);

    const collectionNames = await apiGateway.getAsync<string[]>(
        `api/v1/mongo/collections`,
        auth.accessToken);

    setAuth(auth);
    return collectionNames;
}