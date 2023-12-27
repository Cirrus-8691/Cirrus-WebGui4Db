import { BaseService } from "./Service";


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