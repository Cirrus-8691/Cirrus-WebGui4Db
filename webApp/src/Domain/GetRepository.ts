import { Repository } from "../Controllers/TestConnection";

export const GetRepository = (serviceName: string, repositories: Repository[]): Repository => {
    const service = serviceName.toUpperCase();
    const expectedRepositoryDefaultName = process.env[`REACT_APP_${service}_REPOSITORY`];
    if(expectedRepositoryDefaultName) {
        const findedRepo = repositories.find(repo => repo.name===expectedRepositoryDefaultName);
        return findedRepo ? findedRepo : repositories[0];
    }
    else {
        return repositories[0];
    }
}