import HttpFastifyServer from "./serviceGenericDatabase/HttpFastifyServer";
import Database from "./serviceGenericDatabase/Model/Database";
import Service from "./serviceGenericDatabase/Service";
import MongoQueryController from "./serviceMongodb/Controller/MongoQueryController";
import MongoDatabase from "./serviceMongodb/Model/MongoDatabase";
import PostgreSqlQueryController from "./servicePostgreSql/Controller/PostgreSqlQueryController";
import PostgreSqlDatabase from "./servicePostgreSql/Model/PostgreSqlDatabase";

const exitHandler = async (serviceStarted: Service | undefined): Promise<void> => {
    console.log(`Process terminated by SIGNAL`);
    if (serviceStarted) {
        console.log("Disposing: " + serviceStarted.toString());
        await serviceStarted.dispose();
    }
    process.exit(0);
}

export const startService = async (port: string | undefined, injectService: (url: URL) => Service): Promise<Service | undefined> => {
    let serviceStarted: Service | undefined = undefined;
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
    const port = process.env.SERVICE_PORT; // expecting 4000
    const portApiGateway = parseInt(port??"4000");
    //graphicArt()
    // startService(
    //     port,
    //     (url: URL) => (new Service(
    //         url,
    //         true,
    //         new PostgreSqlDatabase(),
    //         (server: HttpFastifyServer, db: Database) => (new PostgreSqlQueryController(server, db)))
    //     ));
    const postMongo = (portApiGateway + 1).toString();
    startService(
        postMongo,
        (url: URL) => (new Service(
            url,
            true,
            new MongoDatabase(),
            (server: HttpFastifyServer, db: Database) => (new MongoQueryController(server, db)))
        ));
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
