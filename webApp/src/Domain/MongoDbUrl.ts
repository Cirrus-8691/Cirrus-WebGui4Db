import { ConnexionDetails, DbUrl } from "./DbUrl";

export const MongoDbProtocol = "mongodb:";
/**
 * https://www.mongodb.com/docs/manual/reference/connection-string/
 */
export default class MongoDbUrl implements DbUrl {

    private readonly params: ConnexionDetails;

    public constructor(params: ConnexionDetails) {
        this.params = params;
    }

    build(params: ConnexionDetails) : DbUrl {
        return new MongoDbUrl(params);
    }

    //"mongodb://usr:Flin*123@192.168.232.133:27017/Histo")
    public static Sample = new MongoDbUrl({
        username: "usr",
        password: "Flin*123",
        hostname: "192.168.232.133",
        port: "27017",
        database: "/Histo"
    });

    public toString(): string {
        const userPassword = this.params.username
            ? `${this.params.username}${this.params.password
                ? `:${this.params.password}`
                : ""}`
            : "";
        const port = this.params.port
            ? `:${this.params.port}`
            : "";
        const path = (this.params.database && this.params.database !== "")
            ? this.params.database?.startsWith("/")
                ? this.params.database
                : `/${this.params.database}`
            : "";
        return `${MongoDbProtocol}//${userPassword}@${this.params.hostname}${port}${path}`;
    }

    public logo(): string {
        return "🌿";
    }

    public info(): string {
        return "Using MongoDb authentication Mechanism: DEFAULT";
    }

    public service(): string {
        return "mongo";
    }

    public repositoriesName() :string {
        return "Collections";
    }

    public get protocol() { return MongoDbProtocol; }
    public get username() { return this.params.username ?? ""; }
    public get password() { return this.params.password ?? ""; }
    public get hostname() { return this.params.hostname ?? ""; }
    public get database() { return this.params.database ?? ""; }
    public get port() { return this.params.port ?? ""; }

}
