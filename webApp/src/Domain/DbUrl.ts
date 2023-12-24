export interface DbUrl {
    toString(): string;
    logo(): string;
    info(): string;

    build(params: ConnexionDetailes) : DbUrl;
}

export interface ConnexionDetailes {
    hostname?: string;
    port?: string;
    database?: string;
    username?: string;
    password?: string;
}