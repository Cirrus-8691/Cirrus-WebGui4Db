import { ConnexionDetailes, DbUrl } from "./DbUrl";

export const MongoDbProtocol = "mongodb:";
const OtherProtocol = "mongodb+srv:";
/**
 * https://www.mongodb.com/docs/manual/reference/connection-string/
 */
export default class MongoDbUrl implements DbUrl {

    private readonly origProtocol: string;
    private readonly httpUrl: URL;

    public constructor(url: string) {
        this.httpUrl = new URL(url);
        this.origProtocol = this.httpUrl.protocol;
        if (this.origProtocol !== MongoDbProtocol && this.protocol !== OtherProtocol) {
            throw new Error(`Unexpected URL protocol! Only protocols: ['${MongoDbProtocol}','${OtherProtocol}'] are managed`);
        }

        this.httpUrl.protocol = "http";
    }

    public build(params: ConnexionDetailes): DbUrl {
        const userPassword = params.username
            ? `${params.username}${params.password
                ? `:${params.password}`
                : ""}`
            : "";
        const port = params.port
            ? `:${params.port}`
            : "";
        const path = (params.database && params.database !== "")
            ? params.database?.startsWith("/")
                ? params.database
                : `/${params.database}`
            : "";
        return new MongoDbUrl(`${MongoDbProtocol}//${userPassword}@${params.hostname}${port}${path}`);
    }

    //"mongodb://usr:Flin*123@192.168.232.133:27017/Histo")
    public static Sample = (new MongoDbUrl("")).build({
            username: "usr",
            password: "Flin*123",
            hostname: "192.168.232.133",
            port: "27017",
            database: "/Histo"
    });

    public toString(): string {
        return this.httpUrl.toString().replace("http:", this.origProtocol);
    }
    
    public logo(): string {
        return "🌿";
    }

    public info(): string {
        return "Using MongoDb authentication Mechanism: DEFAULT";
    }

    public toSave(): string {
        const url = new URL(this.httpUrl.toString());
        url.username = "";
        url.password = "";
        return url.toString().replace("http:", this.origProtocol);
    }

    public get protocol() { return this.origProtocol; }
    public get username() { return this.httpUrl.username; }
    public get password() { return this.httpUrl.password; }
    public get hostname() { return this.httpUrl.hostname; }
    public get pathname() { return this.httpUrl.pathname; }
    public get port() { return this.httpUrl.port; }

}
