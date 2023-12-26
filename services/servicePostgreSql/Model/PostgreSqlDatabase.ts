import postgres from 'postgres'

import Database from "../../serviceGenericDatabase/Model/Database";
import DbEntity from "../../serviceGenericDatabase/Model/DbEntity";
import DbConnect from "../../serviceGenericDatabase/Model/DbConnect";
import { QueryEntityParameters, QueryFindParameters } from "../../serviceGenericDatabase/Domain/QueryParameters";

export default class PostgreSqlDatabase implements Database {

    private sql: postgres.Sql | undefined = undefined;

    connect(dbConnect: DbConnect): void {
        this.sql = postgres({
            host: dbConnect.hostname,
            port: dbConnect.port ? parseInt(dbConnect.port) : undefined,
            db: dbConnect.database,
            username: dbConnect.username,
            password: dbConnect.password
        });
    }

    async test(): Promise<void> {
        if (this.sql) {
            await this.sql`SELECT 1`
        }
        else {
            throw new Error("Undefined MongoClient URL")
        }
    }

    async getRepositories(): Promise<string[]> {
        if (this.sql) {
            const tablenames = await this.sql<({ table_name: string } | undefined)[]>`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`;
            if (tablenames) {
                return tablenames.map(obj => obj?.table_name ?? "");
            }
            return [];

        }
        else {
            throw new Error("Undefined MongoClient URL")
        }
    }

    async findOnRepository(parameters: QueryFindParameters): Promise<DbEntity[]> {
        if (this.sql) {
            const tableName = parameters.collection;
            const data = await this.sql`SELECT * FROM ${this.sql(tableName)} WHERE ${this.sql(parameters.what)}`;
            if (data) {
                return data;
            }
            return [];
        }
        else {
            throw new Error("Undefined PostgreSql instance")
        }
    }

    async insertEntity(parameters: QueryEntityParameters, doc: DbEntity): Promise<boolean> {
        if (this.sql) {
            const tableName = parameters.collection;
            const result = await this.sql`INSERT INTO ${this.sql(tableName)} ${this.sql(doc)}`
            return result !== undefined;
        }
        else {
            throw new Error("Undefined PostgreSql instance")
        }
    }

    async getPrimaryIndexOf(tableName: string): Promise<string> {
        if (this.sql) {
            const columnNames = await this.sql<({ column_name: string } | undefined)[]>`SELECT c.column_name
                FROM information_schema.table_constraints tc 
                JOIN information_schema.constraint_column_usage AS ccu USING (constraint_schema, constraint_name) 
                JOIN information_schema.columns AS c ON c.table_schema = tc.constraint_schema
                AND tc.table_name = c.table_name AND ccu.column_name = c.column_name
                WHERE tc.constraint_type = 'PRIMARY KEY' AND tc.table_name = '${tableName}'`;
            if (columnNames) {
                return columnNames[0]?.column_name ?? "";
            }
            return "";
        }
        else {
            throw new Error("Undefined PostgreSql instance")
        }
    }

    async updateEntity(parameters: QueryEntityParameters, doc: DbEntity): Promise<boolean> {
        if (this.sql) {
            const tableName = parameters.collection;
            const indexColumn = await this.getPrimaryIndexOf(tableName);
            const result = await this.sql`UPDATE ${tableName} SET ${this.sql(doc)} WHERE ${indexColumn}=${doc[indexColumn]}`
            return result !== undefined;
        }
        else {
            throw new Error("Undefined PostgreSql instance")
        }
    }

    async deleteEntity(parameters: QueryEntityParameters): Promise<boolean> {
        if (this.sql) {
            const tableName = parameters.collection;
            const indexColumn = await this.getPrimaryIndexOf(tableName);
            const result = await this.sql`DELETE FROM ${tableName} WHERE ${indexColumn}=${parameters._id ?? ""}`
            return result !== undefined;
        }
        else {
            throw new Error("Undefined PostgreSql instance")
        }
    }

    dispose(): void {
        if (this.sql) {
            this.sql.end();
        }
    }
}