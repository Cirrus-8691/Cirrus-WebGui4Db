export default interface DbConnect {

    toString(): string;

    get protocol(): string;
    get username(): string;
    get password(): string;
    get hostname(): string;
    get database(): string;
    get port(): string;
}

export interface ConnexionDetails {
    hostname?: string;
    port?: string;
    database?: string;
    username?: string;
    password?: string;
}