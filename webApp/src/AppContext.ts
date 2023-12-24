import { Auth, EmptyAuth } from "./Controllers/Auth";
import { DbUrl } from "./Domain/DbUrl";
import MongoDbUrl from "./Domain/MongoDbUrl";
import PostgreSqlUrl from "./Domain/PostgreSqlUrl";

export default class AppContext {

    error: unknown = undefined;
    setError = (value: unknown) => {
        this.error = value
    };

    auth: Auth = EmptyAuth;
    setAuth = (value: Auth) => {
        this.auth = value
    };

    databaseConnexion: DbUrl = DefaultDatabaseConnection;
    setDatabaseConnexion = (value: DbUrl) => {
        this.databaseConnexion = value
    };

    databaseRepositories: string[] = [DefaultDbRepository];
    setDatabaseRepositories = (value: string[]) => {
        this.databaseRepositories = value
    };

    databaseRepository: string = DefaultDbRepository;
    setDatabaseRepository = (value: string) => {
        this.databaseRepository = value
    };

    databaseQuery: string = DefaultDbQuery;
    setDatabaseQuery = (value: string) => {
        this.databaseQuery = value
    };
}
export const DefaultDbRepository = process.env.REACT_APP_MONGO_COLLECTION ?? "payments";
export const DefaultDbQuery = "{}";

const defaultConnection = (): MongoDbUrl => {
    if (process.env.REACT_APP_MONGO_HOST) {
        console.log("────────────────────────────────────────────");
        console.log(`🌟 MongoDbUrl: use REACT_APP_MONGO...`);
        console.log("────────────────────────────────────────────");
        return new MongoDbUrl({
            hostname: process.env.REACT_APP_MONGO_HOST,
            port: process.env.REACT_APP_MONGO_PORT,
            database: process.env.REACT_APP_MONGO_DATABASE
        });
    }
    else {
        console.log("────────────────────────────────────────────");
        console.log(`🌟 MongoDbUrl: Sample`);
        console.log("────────────────────────────────────────────");
        return MongoDbUrl.Sample;
    }
}
export const DefaultDatabaseConnection = defaultConnection();

const otherConnections = (): DbUrl[] => {
    const otherUrl: DbUrl[] = [];
    if (process.env.REACT_APP_POSTGRE_HOST) {
        console.log("────────────────────────────────────────────");
        console.log(`🌟 PostgreSqlUrl: use REACT_APP_POSTGRE...`);
        console.log("────────────────────────────────────────────");
        const dbUrl = new PostgreSqlUrl({
            hostname: process.env.REACT_APP_POSTGRE_HOST,
            port: process.env.REACT_APP_POSTGRE_PORT,
            database: process.env.REACT_APP_POSTGRE_DATABASE
        });
        otherUrl.push(dbUrl);
    }
    return otherUrl;
}
export const DatabaseConnections: DbUrl[] = [DefaultDatabaseConnection, ...otherConnections()];
