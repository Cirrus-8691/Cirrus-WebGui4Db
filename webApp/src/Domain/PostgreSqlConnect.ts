import { ConnexionDetails, DbConnect } from "./DbConnect";

export default class PostgreSqlUrl implements DbConnect {

    // "Host=192.168.0.30;Database=fred-24;Username=usr;Password=Pwd*175";
    private readonly params: ConnexionDetails;

    public constructor(params: ConnexionDetails) {
        this.params = params;
    }

    build(params: ConnexionDetails) : DbConnect {
        return new PostgreSqlUrl(params);
    }

    toString(): string {
        const userPassword = this.params.username
            ? `Username=${this.params.username};${this.params.password
                ? `Password=${this.params.password};`
                : ""}`
            : "";
        const port = this.params.port
            ? `Port=${this.params.port};`
            : "";
        const database = (this.params.database && this.params.database !== "")
            ? `Database=${this.params.database};`
            : "";
        return `Host=${this.params.hostname};${port}${database}${userPassword}`;
    }

    public logo(): string {
        return "🐘";
    }

    public info(): string {
        return "PostgreSql connexion string";
    }

    public service(): string {
        return "postgre";
    }

    public repositoriesName() :string {
        return "Table";
    }

    queryToFindAllEntities(): string {
        return "";
    }

    public get protocol() { return ""; }
    public get username() { return this.params.username ?? ""; }
    public get password() { return this.params.password ?? ""; }
    public get hostname() { return this.params.hostname ?? ""; }
    public get database() { return this.params.database ?? ""; }
    public get port() { return this.params.port ?? ""; }

}