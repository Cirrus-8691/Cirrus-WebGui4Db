import './App.css';
import React, { useState } from 'react';
import PageMain from './PageMain';
import AppContext, { DefaultDatabaseConnection } from './AppContext';
import PageLogin from './PageLogin';
import { Auth, EmptyAuth } from './Controllers/Auth';
import { DbConnect } from './Domain/DbConnect';
import { EmptyRepository, Repository } from './Controllers/TestConnection';

export const MainContext = React.createContext(new AppContext());

export default function App() {

  const [error, setError] = useState<unknown>(undefined);
  const [auth, setAuth] = useState<Auth>(EmptyAuth);
  const [databaseConnexion, setDatabaseConnexion] = useState<DbConnect>(DefaultDatabaseConnection);
  const [databaseRepositories, setDatabaseRepositories] = useState<Repository[]>([]);
  const [databaseRepository, setDatabaseRepository] = useState<Repository>(EmptyRepository);
  const [databaseQuery, setDatabaseQuery] = useState<string>("");

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
