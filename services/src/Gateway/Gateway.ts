import { PackageJson } from "../GenericServiceDatabase/Domain/PackageJson";
import HttpFastifyServer from "../GenericServiceDatabase/HttpFastifyServer";
import { BaseService } from "../GenericServiceDatabase/Service";
import MongoController from "./Controller/MongoController";
import PostgreController from "./Controller/PostgreController";
import BaseController from "./Controller/BaseController";

export default class Gateway implements BaseService {

    public readonly name = `${PackageJson().name}-gateway`;
    public readonly version = parseInt(PackageJson().version ?? "0");

    public readonly server: HttpFastifyServer;

    public constructor(url: URL, logger: boolean, origin? : string) {
        this.server = new HttpFastifyServer({
            url,
            logger,
            name: this.name,
            description: PackageJson().description,
            version: this.version,
            origin,
            tags: [
                BaseController.Tag,
                MongoController.Tag,
                PostgreController.Tag
            ]

        });
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
        const author = PackageJson().author;
        return `${this.name} v${this.version} (c)${author}`;
    }
}