import Database from "./Model/Database";
import { PackageJson } from "./Domain/PackageJson";
import HttpFastifyServer from "./HttpFastifyServer";

export default class Service {

    public static readonly Name = PackageJson().name;
    public static readonly Desc = PackageJson().version;
    public static readonly Version = PackageJson().version;

    private readonly server: HttpFastifyServer;
    public get Server() : HttpFastifyServer { return this.server }

    public constructor(url: URL, logger : boolean, db : Database, createController :(server: HttpFastifyServer, db : Database) => void) {
        this.server = new HttpFastifyServer(url, logger);
        createController(this.server, db);
    }

    public async start(): Promise<void> {
        await this.server.start();
    }

    public async dispose(): Promise<void> {
        if (this.server) {
            await this.server.close();
        }
    }

    public toString(): string {
        return `${Service.Name} v${Service.Version} (c)${PackageJson().author}`;
    }
}