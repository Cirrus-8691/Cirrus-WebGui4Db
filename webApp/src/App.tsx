import './App.css';
import React, { useEffect, useState } from 'react';
import PageMain from './PageMain';
import AppContext, { DefaultDatabaseConnection, DefaultDbRepository, DefaultDbQuery } from './AppContext';
import { ValidateConnection } from './Controllers/TestConnection';
import PageLogin from './PageLogin';
import { Auth, EmptyAuth } from './Controllers/Auth';

export const MainContext = React.createContext(new AppContext());

export default function App() {

  const [error, setError] = useState<unknown>(undefined);
  const [auth, setAuth] = useState<Auth>(EmptyAuth);
  const [mongoCollections, setMongoCollections] = useState<string[]>([DefaultDbRepository]);
  const [mongoCollection, setMongoCollection] = useState<string>(DefaultDbRepository);
  const [mongoQuery, setMongoQuery] = useState<string>(DefaultDbQuery);

  useEffect(() => {
    const chkConnexion = async () => {
      setError(undefined);
      try {
        const collections = await ValidateConnection(DefaultDatabaseConnection, setAuth);
        setMongoCollections(collections);

        const previousCollection = localStorage.getItem("Cirrus-WebGui4Db-MongoCollection");
        const collection = previousCollection && collections.includes(previousCollection)
          ? previousCollection
          : collections[0];
        setMongoCollection(collection);
      }
      catch (error: unknown) {
        setError(error);
      }
    }
    if (DefaultDatabaseConnection.username && DefaultDatabaseConnection.password) {
      chkConnexion();
    }
  }, []);

  return (
    <div className="App-main">
      <MainContext.Provider value={{
        error, setError,
        auth, setAuth,
        databaseRepositories: mongoCollections, setDatabaseRepositories: setMongoCollections,
        databaseRepository: mongoCollection, setDatabaseRepository: setMongoCollection,
        databaseQuery: mongoQuery, setDatabaseQuery: setMongoQuery
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
