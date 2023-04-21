import './App.css';
import React, { useEffect, useState } from 'react';
import PageMain from './PageMain';
import AppContext, { DefaultMongoConnection, DefaultDbCollection, DefaultDbQuery } from './AppContext';
import { ValidateConnection } from './Controllers/TestConnection';
import PageLogin from './PageLogin';
import { Auth, EmptyAuth } from './Controllers/Auth';

export const MainContext = React.createContext(new AppContext());

export default function App() {

  const [error, setError] = useState<unknown>(undefined);
  const [auth, setAuth] = useState<Auth>(EmptyAuth);
  const [mongoCollections, setMongoCollections] = useState<string[]>([DefaultDbCollection]);
  const [mongoCollection, setMongoCollection] = useState<string>(DefaultDbCollection);
  const [mongoQuery, setMongoQuery] = useState<string>(DefaultDbQuery);

  useEffect(() => {
    const chkConnexion = async () => {
      setError(undefined);
      try {
        const collections = await ValidateConnection(DefaultMongoConnection, setAuth);
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
    if (DefaultMongoConnection.username && DefaultMongoConnection.password) {
      chkConnexion();
    }
  }, []);

  return (
    <div className="App-main">
      <MainContext.Provider value={{
        error, setError,
        auth, setAuth,
        mongoCollections, setMongoCollections,
        mongoCollection, setMongoCollection,
        mongoQuery, setMongoQuery
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
