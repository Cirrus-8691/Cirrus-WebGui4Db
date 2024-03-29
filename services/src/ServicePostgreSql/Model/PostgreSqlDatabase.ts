import { Client } from 'pg';
import Database, { Repository } from '../../GenericServiceDatabase/Model/Database';
import DbConnect from '../../GenericServiceDatabase/Model/DbConnect';
import { QueryEntityParameters, QueryFindParameters } from '../../GenericServiceDatabase/Domain/QueryParameters';
import DbEntity from '../../GenericServiceDatabase/Model/DbEntity';


export default class PostgreSqlDatabase implements Database {

    private client: Client | undefined = undefined;

    async connect(dbConnect: DbConnect): Promise<void> {
        this.client = new Client({
            host: dbConnect.hostname,
            port: dbConnect.port ? parseInt(dbConnect.port) : undefined,
            database: decodeURIComponent(dbConnect.database),
            user: decodeURIComponent(dbConnect.username),
            password: decodeURIComponent(dbConnect.password)
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

    async getRepositories(): Promise<Repository[]> {
        if (this.client) {
            const columnNames = await this.client.query<{ column_name: string; table_name: string; }>(`SELECT c.column_name,t.table_name
                FROM information_schema.table_constraints tc 
                JOIN information_schema.constraint_column_usage AS ccu USING (constraint_schema, constraint_name) 
                JOIN information_schema.columns AS c ON c.table_schema = tc.constraint_schema
                    AND tc.table_name = c.table_name AND ccu.column_name = c.column_name
                JOIN information_schema.tables AS t ON t.table_schema='public'
                WHERE tc.constraint_type = 'PRIMARY KEY' AND tc.table_name = t.table_name`);
            const repositories = columnNames.rows.map<Repository>(c => ({
                name: c.table_name ?? "",
                primaryKey: c.column_name ?? ""
            }));
            return repositories;
        }
        else {
            throw new Error("Undefined PostgreSql instance")
        }
    }

    async findOnRepository(parameters: QueryFindParameters): Promise<DbEntity[]> {
        if (this.client) {
            const tableName = parameters.repository;
            const query = (parameters.what //&& parameters.what !== ""
                ? `SELECT * FROM "${tableName}" WHERE ${parameters.what}`
                : `SELECT * FROM "${tableName}"`)
                + (parameters.limit ? ` LIMIT ${parameters.limit}` : "")
                + (parameters.skip ? ` OFFSET ${parameters.skip}` : "");
            const data = await this.client.query(query);
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
            columnsList.push(`"${key}"`);
            values.push(doc[key]);
            valuesList.push("$" + idCol);
            idCol++;
        }
        return { values, columnsList, valuesList };
    }

    async insertEntity(parameters: QueryEntityParameters, payload: { entity: DbEntity }): Promise<boolean> {
        if (this.client) {
            const tableName = parameters.repository;
            const { values, columnsList, valuesList } = this.columnsData(payload.entity);
            const query = `INSERT INTO "${tableName}"(${columnsList.join(",")}) VALUES (${valuesList.join(",")}) RETURNING *`;
            const result = await this.client.query(query, values);
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

    async updateEntity(parameters: QueryEntityParameters, payload: { entity: DbEntity }): Promise<boolean> {
        if (this.client) {
            const tableName = parameters.repository;
            const indexColumn = await this.getPrimaryIndexOf(tableName);
            const { values, columnsList, valuesList } = this.columnsData(payload.entity);
            const set: string[] = [];
            for (let index = 0; index < columnsList.length; index++) {
                set.push(`${columnsList[index]}=(${valuesList[index]})`);
            }
            values.push(payload.entity[indexColumn]);
            const query = `UPDATE "${tableName}" SET ${set.join(",")} WHERE "${indexColumn}"=($${values.length})`;
            const result = await this.client.query(query, values);
            return result !== undefined;
        }
        else {
            throw new Error("Undefined PostgreSql instance")
        }
    }

    async deleteEntity(parameters: QueryEntityParameters): Promise<boolean> {
        if (this.client) {
            const tableName = parameters.repository;
            const indexColumn = await this.getPrimaryIndexOf(tableName);
            const values: string[] = [parameters._id ?? ""];
            const query = `DELETE FROM "${tableName}" WHERE "${indexColumn}"=($1)`;
            const result = await this.client.query(query, values);
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