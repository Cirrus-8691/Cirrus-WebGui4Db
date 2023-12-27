import { PackageJson } from "../GenericServiceDatabase/Domain/PackageJson";
import HttpFastifyServer from "../GenericServiceDatabase/HttpFastifyServer";
import { BaseService } from "../GenericServiceDatabase/Service";

export default class Gateway implements BaseService {

    public static readonly Name = PackageJson().name;
    public static readonly Desc = PackageJson().version;
    public static readonly Version = PackageJson().version;

    private readonly server: HttpFastifyServer;
    public get Server() : HttpFastifyServer { return this.server }

    public constructor(url: URL, logger : boolean, createControllers :(server: HttpFastifyServer) => void) {
        this.server = new HttpFastifyServer(url, logger);
        createControllers(this.server);
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
        return `${Gateway.Name} v${Gateway.Version} (c)${PackageJson().author}`;
    }
}