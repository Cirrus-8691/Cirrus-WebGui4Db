import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export interface Body {
    [key: string]: any;
}

export const HttpHeadersStartWith = "Bearer ";

export default class ApiGateway {

    private readonly backendUrl: URL = new URL("http://localhost");

    public constructor() {
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log(`🌟 env NODE_ENV: ${process.env.NODE_ENV}`);
        const protocol = process.env.REACT_APP_SERVICE_PROTOCOL;
        const host = process.env.REACT_APP_SERVICE_HOST;
        const port = process.env.REACT_APP_SERVICE_PORT;
        const route = process.env.REACT_APP_SERVICE_ROUTE
        console.log("────────────────────────────────────────────");
        console.log(`🌟 env SERVICE_PROTOCOL: ${protocol}`);
        console.log(`🌟 env SERVICE_HOST: ${host}`);
        console.log(`🌟 env SERVICE_PORT: ${port}`);
        console.log(`🌟 env SERVICE_ROUTE: ${route}`);
        console.log("────────────────────────────────────────────");
        if (protocol) {
            this.backendUrl.protocol = protocol;
        }
        else {
            this.backendUrl.protocol = window.location.protocol;
        }
        if (host) {
            this.backendUrl.hostname = host;
        }
        else {
            this.backendUrl.hostname = window.location.hostname;
        }
        if (route) {
            this.backendUrl.href = this.backendUrl.href + route;
        }
        if (port) {
            this.backendUrl.port = port;
        }
        console.log(`🛂 Backend url: ${this.backendUrl.toString()}`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    }

    private getConfig(accessToken?: string): AxiosRequestConfig | undefined {
        return accessToken
            ? {
                headers: {
                    Authorization: HttpHeadersStartWith + accessToken
                }
            }
            : undefined;
    }

    public async postAsync<ResultDataType>(queryPath: string, body: Body, accessToken: string): Promise<ResultDataType> {
        return (await axios.post<ResultDataType, AxiosResponse<ResultDataType>>(
            `${this.backendUrl}${queryPath}`,
            body,
            this.getConfig(accessToken)
        )).data;
    }

    public async putAsync<ResultDataType>(queryPath: string, body: Body, accessToken: string): Promise<ResultDataType> {
        return (await axios.put<ResultDataType, AxiosResponse<ResultDataType>>(
            `${this.backendUrl}${queryPath}`,
            body,
            this.getConfig(accessToken)
        )).data;
    }

    public async deleteAsync<ResultDataType>(queryPath: string, accessToken: string): Promise<ResultDataType> {
        return (await axios.delete<ResultDataType, AxiosResponse<ResultDataType>>(
            `${this.backendUrl}${queryPath}`,
            this.getConfig(accessToken)
        )).data;
    }

    public async getAsync<ResultDataType>(queryPath: string, accessToken?: string): Promise<ResultDataType> {
        return (await axios.get<ResultDataType, AxiosResponse<ResultDataType>>(
            `${this.backendUrl}${queryPath}`,
            this.getConfig(accessToken)
        )).data;
    }

    public post<ResultDataType>(queryPath: string, body: Body,
        callbackThen: (result: ResultDataType) => void,
        callbackCatch: (error: unknown) => void,
        accessToken?: string): void {

        axios.post<ResultDataType, AxiosResponse<ResultDataType>>(
            `${this.backendUrl}${queryPath}`,
            body,
            this.getConfig(accessToken)
        )
            .then((result: AxiosResponse<ResultDataType>) => callbackThen(result.data))
            .catch((error) => callbackCatch(error));
    }

    public get<ResultDataType>(queryPath: string,
        callbackThen: (result: ResultDataType) => void,
        callbackCatch: (error: unknown) => void,
        accessToken?: string,): void {

        axios.get<ResultDataType, AxiosResponse<ResultDataType>>(
            `${this.backendUrl}${queryPath}`,
            this.getConfig(accessToken)
        )
            .then((result: AxiosResponse<ResultDataType>) => callbackThen(result.data))
            .catch((error) => callbackCatch(error));
    }
}