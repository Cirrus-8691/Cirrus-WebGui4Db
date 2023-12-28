import Database from "./Model/Database";
import { PackageJson } from "./Domain/PackageJson";
import HttpFastifyServer from "./HttpFastifyServer";
import Controller from "./Controller/Controller";

export interface BaseService {
    start(): Promise<void>;
    toString(): string;
    dispose(): Promise<void>;
}

export interface ServiceOptions {
    url: URL, 
    name: string,
    logger?: boolean, 
    db?: Database
}

export default class Service implements BaseService {

    public readonly name: string;

    private readonly server: HttpFastifyServer;
    private readonly controller: Controller;

    public constructor(options: ServiceOptions, createController: (server: HttpFastifyServer, db: Database) => Controller) {
        this.name = `${PackageJson().name}-${options.name}`;
        this.server = new HttpFastifyServer(options.url, options.logger??false);
        if(options.db === undefined) {
            throw new Error("Db is mandatory");
        }
        this.controller = createController(this.server, options.db);
    }

    public async start(): Promise<void> {
        await this.server.start();
    }

    public async dispose(): Promise<void> {
        if (this.server) {
            await this.server.close();
            await this.controller.dispose();
        }
    }

    public toString(): string {
        const version = PackageJson().version;
        const author = PackageJson().author;
        return `${this.name} v${version} (c)${author}`;
    }
}