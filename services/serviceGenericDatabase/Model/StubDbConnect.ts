import DbConnect from "./DbConnect";

export default class StubConnect implements DbConnect {
    private readonly connectString : string;
    public constructor(connectString : string) {
        this.connectString = connectString;
    }
    toString(): string {
        return this.connectString;
    }
    get protocol(): string {
        return "";
    }
    get username(): string {
        return "";
    }
    get password(): string {
        return "";
    }
    get hostname(): string {
        return "";
    }
    get database(): string {
        return "";
    }
    get port(): string {
        return "";
    }
    
}
