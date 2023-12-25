import './App.css';
import React, { useEffect, useState } from 'react';
import PageMain from './PageMain';
import AppContext, { DefaultDatabaseConnection, DefaultDbRepository, DefaultDbQuery } from './AppContext';
import { ValidateConnection } from './Controllers/TestConnection';
import PageLogin from './PageLogin';
import { Auth, EmptyAuth } from './Controllers/Auth';
import { DbConnect } from './Domain/DbConnect';

export const MainContext = React.createContext(new AppContext());

export default function App() {

  const [error, setError] = useState<unknown>(undefined);
  const [auth, setAuth] = useState<Auth>(EmptyAuth);
  const [databaseConnexion, setDatabaseConnexion] = useState<DbConnect>(DefaultDatabaseConnection);
  const [databaseRepositories, setDatabaseRepositories] = useState<string[]>([DefaultDbRepository]);
  const [databaseRepository, setDatabaseRepository] = useState<string>(DefaultDbRepository);
  const [databaseQuery, setDatabaseQuery] = useState<string>(DefaultDbQuery);

  useEffect(() => {
    const chkConnexion = async () => {
      setError(undefined);
      try {
        const repositories = await ValidateConnection(databaseConnexion, setAuth);
        setDatabaseRepositories(repositories);

        const repository = repositories[0];
        setDatabaseRepository(repository);
      }
      catch (error: unknown) {
        setError(error);
      }
    }
    if (databaseConnexion.username && databaseConnexion.password) {
      chkConnexion();
    }
  }, [databaseConnexion]);

  return (
    <div className="App-main">
      <MainContext.Provider value={{
        error, setError,
        auth, setAuth,
        databaseConnexion, setDatabaseConnexion,
        databaseRepositories, setDatabaseRepositories,
        databaseRepository, setDatabaseRepository,
        databaseQuery, setDatabaseQuery
      }}>
        {
          auth.accessToken
            ? <PageMain />
            : <PageLogin />
        }
      </MainContext.Provider>
    </div>
  );
}
