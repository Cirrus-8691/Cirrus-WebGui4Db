import { PackageJson } from "../GenericServiceDatabase/Domain/PackageJson";
import HttpFastifyServer from "../GenericServiceDatabase/HttpFastifyServer";
import { BaseService } from "../GenericServiceDatabase/Service";

export default class Gateway implements BaseService {

    public readonly name = `${PackageJson().name}-gateway`;

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
        const version = PackageJson().version;
        const author = PackageJson().author;
        return `${this.name} v${version} (c)${author}`;
    }
}