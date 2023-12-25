import DbConnect, { ConnexionDetails } from "../../../serviceGenericDatabase/src/Model/DbConnect";

export default class PostgreSqlConnect implements DbConnect {

    // or 'postgres://username:password@host:port/database'
    public static Sample = new PostgreSqlConnect("Host=192.168.0.30;Port=5432;Database=fred-24;Username=usr;Password=Pwd*175");

    private readonly params: ConnexionDetails;

    public constructor(url: string) {
        this.params = {
            hostname: "",
            port: "",
            database: "",
            username: "",
            password: ""
        };
        const tokenEqualValues = url.split(";");
        for (const tokenEqualValue of tokenEqualValues) {
            const items = tokenEqualValue.split("=");
            switch (items[0]) {
                case "Host": {
                    this.params.hostname = items[1];
                    break;
                }
                case "Port": {
                    this.params.port = items[1];
                    break;
                }
                case "Database": {
                    this.params.database = items[1];
                    break;
                }
                case "Username": {
                    this.params.username = items[1];
                    break;
                }
                case "Password": {
                    this.params.password = items[1];
                    break;
                }
            }
        }
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

    public get protocol() { return ""; }
    public get username() { return this.params.username ?? ""; }
    public get password() { return this.params.password ?? ""; }
    public get hostname() { return this.params.hostname ?? ""; }
    public get database() { return this.params.database ?? ""; }
    public get port() { return this.params.port ?? ""; }

}
