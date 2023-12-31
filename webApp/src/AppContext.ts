import { Auth, EmptyAuth } from "./Controllers/Auth";
import { DbConnect } from "./Domain/DbConnect";
import MongoDbUrl from "./Domain/MongoDbConnect";
import PostgreSqlUrl from "./Domain/PostgreSqlConnect";

export default class AppContext {

    error: unknown = undefined;
    setError = (value: unknown) => {
        this.error = value
    };

    auth: Auth = EmptyAuth;
    setAuth = (value: Auth) => {
        this.auth = value
    };

    databaseConnexion: DbConnect = DefaultDatabaseConnection;
    setDatabaseConnexion = (value: DbConnect) => {
        this.databaseConnexion = value
    };

    databaseRepositories: string[] = [""];
    setDatabaseRepositories = (value: string[]) => {
        this.databaseRepositories = value
    };

    databaseRepository: string = "";
    setDatabaseRepository = (value: string) => {
        this.databaseRepository = value
    };

    databaseQuery: string = DefaultDbQuery;
    setDatabaseQuery = (value: string) => {
        this.databaseQuery = value
    };
}

export const DefaultDbQuery = "";

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

const otherConnections = (): DbConnect[] => {
    const otherUrl: DbConnect[] = [];
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
export const DatabaseConnections: DbConnect[] = [DefaultDatabaseConnection, ...otherConnections()];
