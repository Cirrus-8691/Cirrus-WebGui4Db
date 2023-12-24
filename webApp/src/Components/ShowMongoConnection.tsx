import { useContext, useState } from "react";
import { MainContext } from "../App";
import { Alert, Button, Form, Offcanvas, Spinner, Stack } from "react-bootstrap";
import MongoDbUrl from "../Domain/MongoDbUrl";
import GetErrorMessage from "../Domain/GetErrorMessage";
import TestConnection, { ValidateConnection } from "../Controllers/TestConnection";
import { DefaultDatabaseConnection } from "../AppContext";

export type ShowConnectionInfo = "" | "user" | "database" | "connection";

export default function ShowMongoConnection(props: { show: ShowConnectionInfo, setShow: (value: ShowConnectionInfo) => void }) {

    const mainContext = useContext(MainContext);
    const [username, setUsername] = useState(mainContext.auth.userName);
    const [password, setPassword] = useState("");
    const [hostname, setHostname] = useState(DefaultDatabaseConnection.hostname);
    const [port, setPort] = useState(DefaultDatabaseConnection.port);
    const [pathname, setPathname] = useState(DefaultDatabaseConnection.pathname);
    const [error, setError] = useState<unknown>(undefined);
    const [info, setInfo] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmitConnection = async () => {
        mainContext.setError(undefined);
        setError(undefined);
        setLoading(true);
        setInfo("🕜 Validating connection...");
        try {
            const newUrl = new MongoDbUrl(MongoDbUrl.buildUrl({
                username,
                password,
                hostname,
                port,
                database: pathname
            }));
            const collections = await ValidateConnection(newUrl, mainContext.setAuth);
            mainContext.setDatabaseRepositories(collections);
            mainContext.setDatabaseRepository(collections[0]);
            localStorage.setItem("Cirrus-WebGui4Db-MongoCollection", collections[0]);
            localStorage.setItem("Cirrus-WebGui4Db-MongoDb-Connection", newUrl.toSave());
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
        setUsername(DefaultDatabaseConnection.username);
        setPassword(DefaultDatabaseConnection.password);
        setHostname(DefaultDatabaseConnection.hostname);
        setPort(DefaultDatabaseConnection.port);
        setPathname(DefaultDatabaseConnection.pathname);
        setError(undefined);
    }

    const onTest = async () => {
        setError(undefined);
        setLoading(true);
        setInfo("🕜 Testing...");
        try {
            const newUrl = new MongoDbUrl(MongoDbUrl.buildUrl({
                username,
                password,
                hostname,
                port,
                database: pathname
            }));
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
                                        placeholder={MongoDbUrl.Sample.pathname}
                                        onChange={(event: any) => setPathname(event.target.value)}
                                        value={pathname} />
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
                                                placeholder={MongoDbUrl.Sample.pathname}
                                                onChange={(event: any) => setPathname("/" + event.target.value)}
                                                value={pathname.replace("/", "")} />
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

