
import { FastifyRequest } from "fastify";
import jwt from 'jsonwebtoken';

import MongoDbUrl from "../Model/MongoDbUrl";

const Secret = "#X83&a*@Ty%5T$*h#7Vz&YPnsH!9XWE26K&25#!P5j*N#2MpYy^4p%a62dT8v%X3";
const LifeSpanSecond = 3600; // 120;

export const HttpHeadersAuthStartWith = "Bearer ";
export interface Auth {
    accessToken: string;
    userName: string;
    dbName: string;
    dbProvider: string;
}

export class JwToken {

    public static authMongoDb(mongoUrl: MongoDbUrl): Auth {
        return {
            accessToken: JwToken.createTokens(mongoUrl.toString()),
            userName: mongoUrl.username,
            dbName: mongoUrl.pathname.replace("/",""),
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

    public static connect(request: FastifyRequest): MongoDbUrl {
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

    private static valideAccessToken = (accessToken: string): MongoDbUrl => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decode: any = jwt.verify(accessToken, Secret);
        const url = decode.url;
        return new MongoDbUrl(url);
    }

}