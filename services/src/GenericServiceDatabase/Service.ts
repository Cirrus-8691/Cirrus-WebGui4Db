import Database from "./Model/Database";
import { PackageJson } from "./Domain/PackageJson";
import HttpFastifyServer from "./HttpFastifyServer";
import Controller from "./Controller/Controller";

export interface BaseService {
    start(): Promise<void>;
    toString(): string;
    dispose(): Promise<void>;
    get server(): HttpFastifyServer;
}

export interface ServiceOptions {
    url: URL,
    name: string,
    logger?: boolean,
    db?: Database
}

export default class Service implements BaseService {

    public readonly name: string;
    public readonly version = parseInt(PackageJson().version ?? "0");
    public readonly server: HttpFastifyServer;

    private readonly controller: Controller;

    public constructor(options: ServiceOptions, createController: (server: HttpFastifyServer, db: Database) => Controller) {
        this.name = `${PackageJson().name}-${options.name}`;
        const description = PackageJson().description;
        this.server = new HttpFastifyServer({
            url: options.url,
            logger: options.logger ?? false,
            name: this.name,
            description,
            version: this.version,
            tags: [{
                name: options.name,
                description
            }]
        });
        if (options.db === undefined) {
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
        const author = PackageJson().author;
        return `${this.name} v${this.version} (c)${author}`;
    }
}