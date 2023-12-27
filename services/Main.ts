import Gateway from "./Gateway/Gateway";
import graphicArtGateway from "./Gateway/GraphicArt";
import HttpFastifyServer from "./GenericServiceDatabase/HttpFastifyServer";
import Database from "./GenericServiceDatabase/Model/Database";
import Service, { BaseService } from "./GenericServiceDatabase/Service";

import graphicArtMongodb from "./ServiceMongodb/GraphicArt";
import MongoQueryController from "./ServiceMongodb/Controller/MongoQueryController";
import MongoDatabase from "./ServiceMongodb/Model/MongoDatabase";

import graphicArtPostgre from "./ServicePostgreSql/GraphicArt";
import PostgreSqlQueryController from "./ServicePostgreSql/Controller/PostgreSqlQueryController";
import PostgreSqlDatabase from "./ServicePostgreSql/Model/PostgreSqlDatabase";

const exitHandler = async (serviceStarted: BaseService | undefined): Promise<void> => {
    console.log(`Process terminated by SIGNAL`);
    if (serviceStarted) {
        console.log("Disposing: " + serviceStarted.toString());
        await serviceStarted.dispose();
    }
    process.exit(0);
}

export const startService = async (port: string | undefined, injectService: (url: URL) => BaseService): Promise<BaseService | undefined> => {
    let serviceStarted: BaseService | undefined = undefined;
    process.once('SIGINT', // action on [Ctrl]+C
        async () => await exitHandler(serviceStarted));
    process.once('SIGTERM', // https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination
        async () => await exitHandler(serviceStarted));
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    const host = process.env.SERVICE_HOST;
    console.log(`🌟 env SERVICE_HOST: ${host !== undefined ? `🆗 ${host}` : '❌ undefined'}`);
    console.log(`🌟 env SERVICE_PORT: ${port ? `🆗 ${port}` : '❌ bad value'}`);
    console.log("────────────────────────────────────────────");
    if (host && port) {
        const url = new URL("http://localhost");
        url.hostname = host;
        url.port = port;
        const hostOk = (url.hostname === host);
        console.log(`🛂 env SERVICE_HOST: ${hostOk ? `✅ ${host}` : '⛔ bad value'}`);
        const portOk = (url.port === port);
        console.log(`🛂 env SERVICE_PORT: ${portOk ? `✅ ${port}` : '⛔ bad value'}`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

        if (hostOk && portOk) {
            serviceStarted = injectService(url);
            console.log("🚀 Starting: " + serviceStarted.toString());
            console.log("────────────────────────────────────────────");
            await serviceStarted.start();
        }
    }
    return serviceStarted;
}

/***
 * Call of Main function to start service
 */
(async function main() {

    // Starting API gateway
    const portGateway = process.env.SERVICE_PORT; // expecting 4000
    const portApiGateway = parseInt(portGateway ?? "4000");
    graphicArtGateway();
    startService(
        portGateway,
        (url: URL) => (new Gateway(
            url,
            true,
            (server: HttpFastifyServer) => {
                //
            })
        ));

    graphicArtMongodb();
    const postMongo = (portApiGateway + 1).toString();
    startService(
        postMongo,
        (url: URL) => (new Service(
            url,
            true,
            new MongoDatabase(),
            (server: HttpFastifyServer, db: Database) => (new MongoQueryController(server, db)))
        ));

    graphicArtPostgre();
    const portPostgre = (portApiGateway + 2).toString();
    startService(
        portPostgre,
        (url: URL) => (new Service(
            url,
            true,
            new PostgreSqlDatabase(),
            (server: HttpFastifyServer, db: Database) => (new PostgreSqlQueryController(server, db)))
        ));

})()
