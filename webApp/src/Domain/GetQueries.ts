
export const GetQueries = (serviceName : string): string[] => {
    const queries = [];
    const service = serviceName.toUpperCase();
    const count = process.env[`REACT_APP_${service}_QUERIES_COUNT`];
    if (count && (+count > 0)) {
        const lenght = 1 + (+count);
        for (let index = 1; index < lenght; index++) {
            const query = process.env[`REACT_APP_${service}_QUERIES_${index}`];
            if (query) {
                queries.push(query)
            }
        }
    }
    return queries;
}