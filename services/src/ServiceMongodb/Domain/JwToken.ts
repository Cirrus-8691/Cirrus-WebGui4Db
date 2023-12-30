import { FastifyRequest } from "fastify";
import MongoDbConnect from "../Model/MongoDbConnect";
import { Auth, GenericJwToken } from "../../GenericServiceDatabase/Domain/GenericJwToken";

export class JwToken extends GenericJwToken {

    public static authToDb(dbUrl: MongoDbConnect): Auth {
        return super.authDb<MongoDbConnect>(dbUrl);
    }

    public static connectTo(request: FastifyRequest): MongoDbConnect {
        const url = super.connect(request);
        return new MongoDbConnect(url);
    }

}