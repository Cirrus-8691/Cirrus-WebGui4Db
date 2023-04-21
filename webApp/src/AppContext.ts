import { Auth, EmptyAuth } from "./Controllers/Auth";
import MongoDbUrl from "./Domain/MongoDbUrl";

export default class AppContext {

    error: unknown = undefined;
    setError = (value: unknown) => {
        this.error = value
    };

    auth: Auth = EmptyAuth;
    setAuth = (value: Auth) => {
        this.auth = value
    };

    mongoCollections: string[] = [DefaultDbCollection];
    setMongoCollections = (value: string[]) => {
        this.mongoCollections = value
    };

    mongoCollection: string = DefaultDbCollection;
    setMongoCollection = (value: string) => {
        this.mongoCollection = value
    };

    mongoQuery: string = DefaultDbQuery;
    setMongoQuery = (value: string) => {
        this.mongoQuery = value
    };

}

const DefaultConnection = (): MongoDbUrl => {
    const prevUrl = localStorage.getItem("Cirrus-WebGui4Db-MongoDb-Connection");
    if (prevUrl) {
        console.log("────────────────────────────────────────────");
        console.log(`🌟 MongoDbUrl: use localStorage`);
        console.log("────────────────────────────────────────────");
        return new MongoDbUrl(prevUrl);
    }
    else {
        if (process.env.REACT_APP_MONGO_HOST) {
            console.log("────────────────────────────────────────────");
            console.log(`🌟 MongoDbUrl: use REACT_APP_MONGO...`);
            console.log("────────────────────────────────────────────");
            return new MongoDbUrl(MongoDbUrl.BuildUrl({
                hostname: process.env.REACT_APP_MONGO_HOST,
                port: process.env.REACT_APP_MONGO_PORT,
                pathname: process.env.REACT_APP_MONGO_PATH
            }));
        }
        else {
            console.log("────────────────────────────────────────────");
            console.log(`🌟 MongoDbUrl: Sample`);
            console.log("────────────────────────────────────────────");
            return MongoDbUrl.Sample;
        }
    }
}
export const DefaultMongoConnection = DefaultConnection();

export const DefaultDbCollection = process.env.REACT_APP_MONGO_COLLECTION ?? "payments";
export const DefaultDbQuery = "{}";
