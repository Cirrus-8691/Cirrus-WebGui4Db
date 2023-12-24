import { useContext, useState } from "react";
import { MainContext } from "../App";
import { Alert, Button, Form, Offcanvas, Spinner, Stack } from "react-bootstrap";
import MongoDbUrl from "../Domain/MongoDbUrl";
import GetErrorMessage from "../Domain/GetErrorMessage";
import TestConnection, { ValidateConnection } from "../Controllers/TestConnection";
import { DefaultDatabaseConnection } from "../AppContext";

export type ShowConnectionInfo = "" | "user" | "database" | "connection";

export default function ShowDatabaseConnection(props: { show: ShowConnectionInfo, setShow: (value: ShowConnectionInfo) => void }) {

    const mainContext = useContext(MainContext);
    const [username, setUsername] = useState(mainContext.auth.userName);
    const [password, setPassword] = useState("");
    const [hostname, setHostname] = useState(mainContext.databaseConnexion.hostname);
    const [port, setPort] = useState(mainContext.databaseConnexion.port);
    const [database, setDatabase] = useState(mainContext.databaseConnexion.database);
    const [error, setError] = useState<unknown>(undefined);
    const [info, setInfo] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmitConnection = async () => {
        mainContext.setError(undefined);
        setError(undefined);
        setLoading(true);
        setInfo("🕜 Validating connection...");
        try {
            const newUrl = mainContext.databaseConnexion.build({
                username,
                password,
                hostname,
                port,
                database: database
            });
            const repositories = await ValidateConnection(newUrl, mainContext.setAuth);
            mainContext.setDatabaseRepositories(repositories);
            mainContext.setDatabaseRepository(repositories[0]);
            setPassword("");
            setInfo("");
            setLoading(false);
            props.setShow("");
        }
        catch (error: unknown) {
            setError(error);
            setInfo("");
            setLoading(false);
        }
    }

    const onCancel = () => {
        props.setShow("");
        setUsername(mainContext.databaseConnexion.username);
        setPassword(mainContext.databaseConnexion.password);
        setHostname(mainContext.databaseConnexion.hostname);
        setPort(mainContext.databaseConnexion.port);
        setDatabase(mainContext.databaseConnexion.database);
        setError(undefined);
    }

    const onTest = async () => {
        setError(undefined);
        setLoading(true);
        setInfo("🕜 Testing...");
        try {
            const newUrl = mainContext.databaseConnexion.build({
                username,
                password,
                hostname,
                port,
                database: database
            });
            await TestConnection(newUrl);
            setInfo(`✅ Connection test: Ok`);
            setLoading(false);
        }
        catch (error: unknown) {
            setError(error);
            setInfo("");
            setLoading(false);
        }
    }

    return (

        <Offcanvas show={props.show !== ""} onHide={onCancel} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>🌿 Mongodb database connection</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form>
                    <Form.Group className="mb-3">
                        {
                            props.show === "connection"
                                ? <>
                                    <Form.Label>Protocol:</Form.Label>
                                    <Form.Control type="text" disabled
                                        value={DefaultDatabaseConnection.protocol} />
                                    <br />
                                    <Form.Label>👤 User name:</Form.Label>
                                    <Form.Control type="text"
                                        placeholder={MongoDbUrl.Sample.username}
                                        onChange={(event: any) => setUsername(event.target.value)}
                                        value={username} />
                                    <Form.Label>Password:</Form.Label>
                                    <Form.Control type="password"
                                        onChange={(event: any) => setPassword(event.target.value)}
                                        value={password} />
                                    <Form.Label>Host name:</Form.Label>
                                    <Form.Control type="text"
                                        placeholder={MongoDbUrl.Sample.hostname}
                                        onChange={(event: any) => setHostname(event.target.value)}
                                        value={hostname} />
                                    <Form.Label>Port:</Form.Label>
                                    <Form.Control type="text"
                                        placeholder={MongoDbUrl.Sample.port}
                                        onChange={(event: any) => setPort(event.target.value)}
                                        value={port} />
                                    <Form.Label>Path name ( /[🛢️ Database name] ):</Form.Label>
                                    <Form.Control type="text"
                                        placeholder={MongoDbUrl.Sample.database}
                                        onChange={(event: any) => setDatabase(event.target.value)}
                                        value={database} />
                                </>
                                : props.show === "user"
                                    ? <>
                                        <Form.Label>👤 User name:</Form.Label>
                                        <Form.Control type="text"
                                            placeholder={MongoDbUrl.Sample.username}
                                            onChange={(event: any) => setUsername(event.target.value)}
                                            value={username} />
                                        <Form.Label>Password:</Form.Label>
                                        <Form.Control type="password"
                                            onChange={(event: any) => setPassword(event.target.value)}
                                            value={password} />
                                    </>
                                    : props.show === "database"
                                        ? <>
                                            <Form.Label>👤 User name:</Form.Label>
                                            <Form.Control type="text"
                                                placeholder={MongoDbUrl.Sample.username}
                                                onChange={(event: any) => setUsername(event.target.value)}
                                                value={username} />
                                            <Form.Label>Password:</Form.Label>
                                            <Form.Control type="password"
                                                onChange={(event: any) => setPassword(event.target.value)}
                                                value={password} />
                                            <Form.Label>🛢️ Database name:</Form.Label>
                                            <Form.Control type="text"
                                                placeholder={MongoDbUrl.Sample.database}
                                                onChange={(event: any) => setDatabase("/" + event.target.value)}
                                                value={database} />
                                        </>
                                        : <></>
                        }
                    </Form.Group>
                    <Stack direction="horizontal" gap={2}>
                        <Button onClick={onSubmitConnection}
                            disabled={loading || error !== undefined}
                            variant={error === undefined ? "primary" : "danger"}> Ok</Button>
                        <Button onClick={onCancel} variant="secondary">Cancel</Button>
                        <div className="vr" />

                        {
                            loading
                                ? <Spinner animation="border" variant="success" />
                                : <Button onClick={onTest} variant="success" >Test</Button>
                        }
                    </Stack>
                </Form>
                {
                    error
                        ? <><br /><Alert variant={'danger'}>{GetErrorMessage(error)}</Alert></>
                        :
                        info ? <><br /><Alert variant={'info'}>{info}</Alert></>
                            : <></>
                }
            </Offcanvas.Body>
        </Offcanvas >

    );

}

