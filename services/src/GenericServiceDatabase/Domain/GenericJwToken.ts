
import { FastifyRequest } from "fastify";
import jwt from 'jsonwebtoken';
import { LifeSpanSecond, Secret } from "./LifeSpanSecond";
import { HttpHeadersAuthStartWith } from "../HttpFastifyServer";
import DbConnect from "../Model/DbConnect";

export interface Auth {
    accessToken: string;
    userName: string;
    dbName: string;
    dbProvider: string;
}

export class GenericJwToken {

    protected static authDb<DBC extends DbConnect>(dbUrl: DBC): Auth {
        return {
            accessToken: GenericJwToken.createTokens(dbUrl.toString()),
            userName: dbUrl.username,
            dbName: dbUrl.database,
            dbProvider: dbUrl.protocol
        }
    }

    protected static createTokens = (url: string): string => {
        const accessToken = jwt.sign(
            { url },
            Secret,
            { expiresIn: LifeSpanSecond }
        );
        return accessToken
    }

    protected static connect(request: FastifyRequest): string {
        const accessToken = GenericJwToken.extractToken(request);
        if(!accessToken) {
            throw new Error("Forbidden credentials is undefined");
        }
        return GenericJwToken.valideAccessToken(accessToken);
    }

    public static extractToken = (request: FastifyRequest): string | undefined => {
        const authorization = request.headers.authorization;
        if (authorization && authorization.length > 0) {
            return authorization.substring(HttpHeadersAuthStartWith.length);
        }
        return undefined;
    }

    public static valideAccessToken(accessToken: string): string {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decode: any = jwt.verify(accessToken, Secret);
        const url = decode.url;
        return url;
    }

}