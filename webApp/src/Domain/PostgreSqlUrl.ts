import { DbUrl } from "./DbUrl";

export class PostgreSqlUrl implements DbUrl {

    // "Host=192.168.0.30;Database=fred-24;Username=usr;Password=Pwd*175";
    private connexionString: string;

    public static BuildUrl(params: {
        username?: string
        password?: string
        hostname: string
        port?: string
        database?: string
    }): string {
        const userPassword = params.username
            ? `Username=${params.username};${params.password
                ? `Password=${params.password};`
                : ""}`
            : "";
        const port = params.port
            ? `Port=${params.port};`
            : "";
        const database = (params.database && params.database !== "")
            ? `Database=${params.database};`
            : "";
        return `Host=${params.hostname};${port}${database}${userPassword}`;
    }

    public constructor(connexionString: string) {
        this.connexionString = connexionString;
    }

    toString(): string {
        return this.connexionString;
    }
}