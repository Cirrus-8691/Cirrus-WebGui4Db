import { ConnexionDetailes, DbUrl } from "./DbUrl";

export default class PostgreSqlUrl implements DbUrl {

    // "Host=192.168.0.30;Database=fred-24;Username=usr;Password=Pwd*175";
    private connexionString: string;

    public constructor(connexionString: string) {
        this.connexionString = connexionString;
    }

    public build(params: ConnexionDetailes): DbUrl {
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
        return new PostgreSqlUrl(`Host=${params.hostname};${port}${database}${userPassword}`);
    }

    toString(): string {
        return this.connexionString;
    }

    public logo(): string {
        return "🐘";
    }

    public info(): string {
        return "PostgreSql connexion string";
    }

}