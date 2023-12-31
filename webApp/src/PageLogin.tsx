import { ChangeEvent, useContext, useEffect, useState } from "react";
import { MainContext } from "./App";
import DialogError from "./Components/ShowError";
import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";
import GetErrorMessage from "./Domain/GetErrorMessage";
import { ValidateConnection } from "./Controllers/TestConnection";
import { Application } from "./PageMain";
import { DatabaseConnections } from "./AppContext";
import { DbConnect } from "./Domain/DbConnect";
import { GetRepository } from "./Domain/GetRepository";

export default function PageLogin() {

    const mainContext = useContext(MainContext);

    const [dbUrl, setDbUrl] = useState(mainContext.databaseConnexion);
    const [username, setUsername] = useState(mainContext.databaseConnexion.username);
    const [password, setPassword] = useState(mainContext.databaseConnexion.password);
    const [info, setInfo] = useState(mainContext.databaseConnexion.info());

    useEffect(() => {
        setInfo(dbUrl.info())
    },
        [dbUrl]);

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
                hostname: dbUrl.hostname,
                port: dbUrl.port,
                database: dbUrl.database
            });
            const repositories = await ValidateConnection(newDbUrl, mainContext.setAuth);
            mainContext.setDatabaseConnexion(newDbUrl);
            mainContext.setDatabaseQuery(newDbUrl.queryToFindAllEntities());
            mainContext.setDatabaseRepositories(repositories);
            mainContext.setDatabaseRepository(GetRepository(newDbUrl.service(), repositories))
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
                                            (evnt: ChangeEvent<HTMLSelectElement>) => (setDbUrl(DatabaseConnections[parseInt(evnt.target.value)]))}>
                                            {
                                                DatabaseConnections.map((dbUrl: DbConnect, index: number) => (
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