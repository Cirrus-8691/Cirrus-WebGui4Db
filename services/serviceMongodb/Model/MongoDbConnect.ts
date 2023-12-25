import DbConnect from "../../serviceGenericDatabase/Model/DbConnect";

export const MongoDbProtocol = "mongodb:";
const OtherProtocol = "mongodb+srv:";
/**
 * https://www.mongodb.com/docs/manual/reference/connection-string/
 */
export default class MongoDbConnect implements DbConnect {

    public static Sample = new MongoDbConnect("mongodb://usr:Flin*123@192.168.0.24:27017/Histo");

    private readonly origProtocol: string;
    private readonly httpUrl: URL;

    public constructor(url: string) {
        this.httpUrl = new URL(url);
        this.origProtocol = this.httpUrl.protocol;
        if (this.origProtocol !== MongoDbProtocol && this.protocol!==OtherProtocol) {
            throw new Error(`Unexpected URL protocol! Only protocols: ['${MongoDbProtocol}','${OtherProtocol}'] are managed`);
        }
        
        this.httpUrl.protocol = "http";
    }

    public toString() : string {
        return this.httpUrl.toString().replace("http:", this.origProtocol);
    }

    public get protocol() { return this.origProtocol; }

    public get username() { return this.httpUrl.username; }
    public get password() { return this.httpUrl.password; }
    public get hostname() { return this.httpUrl.hostname; }
    public get database() { return this.httpUrl.pathname; }
    public get port() { return this.httpUrl.port; }

}
