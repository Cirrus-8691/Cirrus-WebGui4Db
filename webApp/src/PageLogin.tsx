import { useContext, useState } from "react";
import { MainContext } from "./App";
import DialogError from "./Components/ShowError";
import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";
import GetErrorMessage from "./Domain/GetErrorMessage";
import MongoDbUrl from "./Domain/MongoDbUrl";
import { ValidateConnection } from "./Controllers/TestConnection";
import { Application } from "./PageMain";
import { DefaultMongoConnection } from "./AppContext";

export default function PageLogin() {

    const mainContext = useContext(MainContext);
    const [username, setUsername] = useState(DefaultMongoConnection.username);
    const [password, setPassword] = useState(DefaultMongoConnection.password);
    const [error, setError] = useState<unknown>(undefined);
    const [info, setInfo] = useState("ℹ️ Using MongoDb authentication Mechanism: DEFAULT");
    const [loading, setLoading] = useState(false);

    const onConnection = async () => {
        mainContext.setError(undefined);
        setError(undefined);
        setLoading(true);
        setInfo("🕜 Validating connection...");
        try {
            const newUrl = new MongoDbUrl(MongoDbUrl.BuildUrl({
                username,
                password,
                hostname: DefaultMongoConnection.hostname,
                port: DefaultMongoConnection.port,
                pathname: DefaultMongoConnection.pathname
            }));
            const collections = await ValidateConnection(newUrl, mainContext.setAuth);
            mainContext.setMongoCollections(collections);
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
                                        <Form.Select disabled>
                                            <option>🌿 {DefaultMongoConnection.toString()}</option>
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