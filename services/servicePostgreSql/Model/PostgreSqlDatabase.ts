import { Client } from 'pg';

import Database from "../../serviceGenericDatabase/Model/Database";
import DbEntity from "../../serviceGenericDatabase/Model/DbEntity";
import DbConnect from "../../serviceGenericDatabase/Model/DbConnect";
import { QueryEntityParameters, QueryFindParameters } from "../../serviceGenericDatabase/Domain/QueryParameters";

export default class PostgreSqlDatabase implements Database {

    private client: Client | undefined = undefined;

    async connect(dbConnect: DbConnect): Promise<void> {
        this.client = new Client({
            host: dbConnect.hostname,
            port: dbConnect.port ? parseInt(dbConnect.port) : undefined,
            database: dbConnect.database,
            user: dbConnect.username,
            password: dbConnect.password
        });
        await this.client.connect();
    }

    async test(): Promise<void> {
        if (this.client) {
            await this.client.query("SELECT 1");
        }
        else {
            throw new Error("Undefined MongoClient URL")
        }
    }

    async getRepositories(): Promise<string[]> {
        if (this.client) {
            const tablenames = await this.client.query<{ table_name: string }>(`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`);
            return tablenames.rows.map(obj => obj?.table_name ?? "");
        }
        else {
            throw new Error("Undefined MongoClient URL")
        }
    }

    async findOnRepository(parameters: QueryFindParameters): Promise<DbEntity[]> {
        if (this.client) {
            const tableName = parameters.collection;
            const data = await this.client.query(`SELECT * FROM ${tableName} WHERE ${parameters.what}`);
            if (data) {
                return data.rows;
            }
            return [];
        }
        else {
            throw new Error("Undefined PostgreSql instance")
        }
    }

    private columnsData(doc: DbEntity): {
        values: string[];
        columnsList: string[];
        valuesList: string[];
    } {
        const values: string[] = [];
        const columnsList: string[] = [];
        const valuesList: string[] = [];
        let idCol = 1;
        for (const key in doc) {
            columnsList.push(key);
            values.push(doc[key]);
            valuesList.push("$" + idCol);
            idCol++;
        }
        return { values, columnsList, valuesList };
    }

    async insertEntity(parameters: QueryEntityParameters, doc: DbEntity): Promise<boolean> {
        if (this.client) {
            const tableName = parameters.collection;
            const { values, columnsList, valuesList } = this.columnsData(doc);
            const result = await this.client.query(`INSERT INTO ${tableName}(${columnsList.join(",")}) VALUES (${valuesList.join(",")}) RETURNING *`, values);
            return result.rowCount !== null && result.rowCount >= 1;
        }
        else {
            throw new Error("Undefined PostgreSql instance")
        }
    }

    async getPrimaryIndexOf(tableName: string): Promise<string> {
        if (this.client) {
            const columnNames = await this.client.query<{ column_name: string }>(`SELECT c.column_name
                FROM information_schema.table_constraints tc 
                JOIN information_schema.constraint_column_usage AS ccu USING (constraint_schema, constraint_name) 
                JOIN information_schema.columns AS c ON c.table_schema = tc.constraint_schema
                AND tc.table_name = c.table_name AND ccu.column_name = c.column_name
                WHERE tc.constraint_type = 'PRIMARY KEY' AND tc.table_name = '${tableName}'`);
            return columnNames.rows[0]?.column_name ?? "";
        }
        else {
            throw new Error("Undefined PostgreSql instance")
        }
    }

    async updateEntity(parameters: QueryEntityParameters, doc: DbEntity): Promise<boolean> {
        if (this.client) {
            const tableName = parameters.collection;
            const indexColumn = await this.getPrimaryIndexOf(tableName);
            const { values, columnsList, valuesList } = this.columnsData(doc);
            const set: string[] = [];
            for (let index = 0; index < columnsList.length; index++) {
                set.push(columnsList[index] + "=" + valuesList[index]);
            }
            const result = await this.client.query(`UPDATE ${tableName} SET ${set.join(",")} WHERE ${indexColumn}=${doc[indexColumn]}`, values);
            return result !== undefined;
        }
        else {
            throw new Error("Undefined PostgreSql instance")
        }
    }

    async deleteEntity(parameters: QueryEntityParameters): Promise<boolean> {
        if (this.client) {
            const tableName = parameters.collection;
            const indexColumn = await this.getPrimaryIndexOf(tableName);
            const result = await this.client.query(`DELETE FROM ${tableName} WHERE ${indexColumn}=${parameters._id ?? ""}`);
            return result.rowCount !== null && result.rowCount >= 1;
        }
        else {
            throw new Error("Undefined PostgreSql instance")
        }
    }

    dispose(): void {
        if (this.client) {
            this.client.end();
        }
    }
}