export class HttpError extends Error {

    readonly statusCode: number;

    constructor(statusCode: number, message: string) {
        super();
        this.message = message;
        this.statusCode = statusCode;
        this.name = "HttpError";
    }

    static toHttpError(err: unknown): HttpError {
        if (err instanceof HttpError) {
            return err as HttpError;
        }
        return new HttpError(500, GetErrorMessage(err))
    }

}

export const GetErrorMessage = (err: unknown): string => {
    let message: string;
    if (err instanceof Error) {
        const error = err as Error
        message = error.message;
    }
    else {
        message = (err as any).toString();
    }
    return message;
}