import { AxiosError, isAxiosError } from "axios";

export default function GetErrorMessage(error: unknown): string {
    if (error === undefined) {
        return "";
    }
    if (typeof (error) === "string") {
        return error;
    }
    if (isAxiosError(error)) {
        const response = (error as AxiosError).response;
        if(response) {
            return response.statusText + ": " + response.data;
        }
        return (error as Error).message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return (error as any).toString();
}
