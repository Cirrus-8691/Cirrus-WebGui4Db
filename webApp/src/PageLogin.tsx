import { ChangeEvent, useContext, useEffect, useState } from "react";
import { MainContext } from "./App";
import DialogError from "./Components/ShowError";
import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";
import GetErrorMessage from "./Domain/GetErrorMessage";
import MongoDbUrl from "./Domain/MongoDbUrl";
import { ValidateConnection } from "./Controllers/TestConnection";
import { Application } from "./PageMain";
import { DatabaseConnections, DefaultDatabaseConnection } from "./AppContext";
import { DbUrl } from "./Domain/DbUrl";

export default function PageLogin() {

    const mainContext = useContext(MainContext);

    const [dbUrl, setDbUrl] = useState<DbUrl>(DefaultDatabaseConnection);
    const [username, setUsername] = useState(DefaultDatabaseConnection.username);
    const [password, setPassword] = useState(DefaultDatabaseConnection.password);
    const [info, setInfo] = useState(DefaultDatabaseConnection.info());

    useEffect(()=> {
        setInfo(dbUrl.info())
    },
    [ dbUrl ]);

    const [error, setError] = useState<unknown>(undefined);
    const [loading, setLoading] = useState(false);


    const onConnection = async () => {
        mainContext.setError(undefined);
        setError(undefined);
        setLoading(true);
        setInfo("🕜 Validating connection...");
        try {
            const newDbUrl = dbUrl.build({
                username,
                password,
                hostname: DefaultDatabaseConnection.hostname,
                port: DefaultDatabaseConnection.port,
                database: DefaultDatabaseConnection.pathname
            });
            const collections = await ValidateConnection(newDbUrl, mainContext.setAuth);
            mainContext.setDatabaseRepositories(collections);
            setInfo("");
            setLoading(false);
        }
        catch {
            setError("Invalid user/password");
            setInfo("");
            setLoading(false);
        }
    }

    return (
        <>
            {
                mainContext.error
                    ? <DialogError />
                    : <>
                        <Modal show={true}>
                            <Modal.Header>
                                <Modal.Title>{"🐻 " + Application.name}</Modal.Title>
                                {Application.version}
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group>
                                        <Form.Label>Connect to:</Form.Label>
                                        <Form.Select onChange={
                                            (evnt: ChangeEvent<HTMLSelectElement>) => ( setDbUrl(DatabaseConnections[parseInt(evnt.target.value)]))}>
                                            {
                                                DatabaseConnections.map((dbUrl: DbUrl, index: number) => (
                                                    <option key={index} value={index}>
                                                        {dbUrl.logo()} {dbUrl.toString()}
                                                    </option >
                                                ))
                                            }
                                        </Form.Select>
                                        <br />
                                        <Form.Label>UserName:</Form.Label>
                                        <Form.Control type="text" autoFocus
                                            onChange={(event: any) => setUsername(event.target.value)}
                                            value={username} />
                                        <Form.Label>Password:</Form.Label>
                                        <Form.Control type="password"
                                            onChange={(event: any) => setPassword(event.target.value)}
                                            value={password} />
                                    </Form.Group>
                                </Form>
                                {
                                    error
                                        ? <><br /><Alert variant={'danger'}>{GetErrorMessage(error)}</Alert></>
                                        : <><br /><Alert variant={'info'}>{info}</Alert></>
                                }

                            </Modal.Body>
                            <Modal.Footer>
                                {
                                    loading
                                        ? <Spinner animation="border" variant="success" />
                                        : <Button onClick={onConnection}
                                            disabled={loading}> Connection</Button>
                                }
                            </Modal.Footer>
                        </Modal>
                    </>
            }
        </>

    );

}