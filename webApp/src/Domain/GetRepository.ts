
export const GetRepository = (serviceName: string, repositories: string[]): string => {
    const service = serviceName.toUpperCase();
    const expectedRepositoryDefaultName = process.env[`REACT_APP_${service}_REPOSITORY`];
    return expectedRepositoryDefaultName ? expectedRepositoryDefaultName : repositories[0];
}