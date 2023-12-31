export interface DbConnect {

    name(): string;
    toString(): string;
    logo(): string;
    info(): string;
    service(): string;
    queryToFindAllEntities(): string;
    repositoriesName(): string;
    findLabel(): string;

    showOperators(): boolean;

    build(params: ConnexionDetails): DbConnect;

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