import { FastifyRequest } from "fastify";
import PostgreSqlConnect from "../Model/PostgreSqlConnect";
import { Auth, GenericJwToken } from "../../GenericServiceDatabase/Domain/GenericJwToken";

export class JwToken extends GenericJwToken {

    public static authToDb(dbUrl: PostgreSqlConnect): Auth {
        return super.authDb<PostgreSqlConnect>(dbUrl);
    }

    public static connectTo(request: FastifyRequest): PostgreSqlConnect {
         const url =  super.connect(request);
         return new PostgreSqlConnect(url);
    }

}