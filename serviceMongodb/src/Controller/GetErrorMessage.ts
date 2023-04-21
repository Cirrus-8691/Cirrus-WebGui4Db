export default function GetErrorMessage(error : unknown) : string {
    if(error===undefined) {
        return "";
    }
    if(error instanceof Error) {
        return error.message;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (error as any).toString();
}