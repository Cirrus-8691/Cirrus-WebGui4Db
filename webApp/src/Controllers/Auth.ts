export interface Auth {
    accessToken: string;
    userName: string;
    dbName: string;
    dbProvider: string;
}

export const EmptyAuth : Auth = {
    accessToken: "",
    userName: "",
    dbName: "",
    dbProvider: ""
}