import './App.css';
import React, { useEffect, useState } from 'react';
import PageMain from './PageMain';
import AppContext, { DefaultDatabaseConnection, DefaultDbQuery } from './AppContext';
import { ValidateConnection } from './Controllers/TestConnection';
import PageLogin from './PageLogin';
import { Auth, EmptyAuth } from './Controllers/Auth';
import { DbConnect } from './Domain/DbConnect';

export const MainContext = React.createContext(new AppContext());

export default function App() {

  const [error, setError] = useState<unknown>(undefined);
  const [auth, setAuth] = useState<Auth>(EmptyAuth);
  const [databaseConnexion, setDatabaseConnexion] = useState<DbConnect>(DefaultDatabaseConnection);
  const [databaseRepositories, setDatabaseRepositories] = useState<string[]>([""]);
  const [databaseRepository, setDatabaseRepository] = useState<string>("");
  const [databaseQuery, setDatabaseQuery] = useState<string>(DefaultDbQuery);

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
