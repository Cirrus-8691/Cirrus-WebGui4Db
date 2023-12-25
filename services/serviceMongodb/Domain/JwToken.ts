
import { FastifyRequest } from "fastify";
import jwt from 'jsonwebtoken';

import MongoDbConnect from "../Model/MongoDbConnect";
import { HttpHeadersAuthStartWith } from "../../serviceGenericDatabase/HttpFastifyServer";
import { LifeSpanSecond, Secret } from "../../serviceGenericDatabase/Domain/LifeSpanSecond";

export interface Auth {
    accessToken: string;
    userName: string;
    dbName: string;
    dbProvider: string;
}

export class JwToken {

    public static authDb(mongoUrl: MongoDbConnect): Auth {
        return {
            accessToken: JwToken.createTokens(mongoUrl.toString()),
            userName: mongoUrl.username,
            dbName: mongoUrl.database,
            dbProvider: "MongoDb"
        }
    }

    private static createTokens = (url: string): string => {
        const accessToken = jwt.sign(
            { url },
            Secret,
            { expiresIn: LifeSpanSecond }
        );
        return accessToken
    }

    public static connect(request: FastifyRequest): MongoDbConnect {
        const accessToken = JwToken.extractToken(request);
        return JwToken.valideAccessToken(accessToken);
    }

    private static extractToken = (request: FastifyRequest): string => {
        const authorization = request.headers.authorization;
        if (authorization && authorization.length > 0) {
            return authorization.substring(HttpHeadersAuthStartWith.length);
        }
        throw Error("request.headers.authorization is undefined or empty");
    }

    private static valideAccessToken = (accessToken: string): MongoDbConnect => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decode: any = jwt.verify(accessToken, Secret);
        const url = decode.url;
        return new MongoDbConnect(url);
    }

}