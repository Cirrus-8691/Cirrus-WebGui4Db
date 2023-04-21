import MongoDatabase from "./Domain/MongoDatabase";
import graphicArt from "./GraphicArt";
import Service from "./Service";

const exitHandler = async (serviceStarted: Service | undefined): Promise<void> => {
    console.log(`Process terminated by SIGNAL`);
    if (serviceStarted) {
        console.log("Disposing: " + serviceStarted.toString());
        await serviceStarted.dispose();
    }
    process.exit(0);
}

/***
 * Call of Main function to start service
 */
(async function main() {
    let serviceStarted: Service | undefined = undefined;
    process.once('SIGINT', // action on [Ctrl]+C
        async () => await exitHandler(serviceStarted));
    process.once('SIGTERM', // https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination
        async () => await exitHandler(serviceStarted));

    graphicArt();
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    const host = process.env.SERVICE_HOST;
    console.log(`🌟 env SERVICE_HOST: ${host !== undefined ? `🆗 ${host}` : '❌ undefined'}`);
    const port = process.env.SERVICE_PORT;
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
            serviceStarted = new Service(
                url,
                true,
                new MongoDatabase());
            console.log("🚀 Starting: " + serviceStarted.toString());
            console.log("────────────────────────────────────────────");
            await serviceStarted.start();
        }
    }

})()


