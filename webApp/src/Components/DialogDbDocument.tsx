import { Button, Form, Modal, Spinner } from "react-bootstrap";
import DbEntity from "../Domain/DbEntity";
import { useContext, useState } from "react";
import { MainContext } from "../App";
import { QueryDeleteParameters, QueryDocumentParameters } from "../Domain/QueryParameters";
import { RunQueryDelete, RunQueryInsert, RunQueryUpdate } from "../Controllers/RunQueries";

export default function DialogDbDocument(props: { entity: DbEntity, hide: (error?: unknown) => void }) {

    const mainContext = useContext(MainContext);
    const [loading, setLoading] = useState(false);
    const isDocNew = JSON.stringify(props.entity)==="{}";
    const [doc, setDoc] = useState(JSON.stringify(props.entity, undefined, " "));

    const onClose = () => props.hide();

    const onDelete = async () => {
        mainContext.setError(undefined);
        setLoading(true);
        try {
            const parameters: QueryDeleteParameters = {
                repository: mainContext.databaseRepository.name,
                _id: props.entity[mainContext.databaseRepository.primaryKey]
            }
            await RunQueryDelete(mainContext.databaseConnexion.service(), parameters, mainContext.auth);
            setLoading(false);
            props.hide();
        }
        catch (error: unknown) {
            setLoading(false);
            props.hide(error);
        }
    };
    const onSave = async () => {
        mainContext.setError(undefined);
        setLoading(true);
        try {
            const parameters: QueryDocumentParameters = {
                repository: mainContext.databaseRepository.name,
                entity: JSON.parse(doc)
            }
            if (parameters.entity[mainContext.databaseRepository.primaryKey]) {
                await RunQueryUpdate(mainContext.databaseConnexion.service(), parameters, mainContext.auth);
            }
            else {
                await RunQueryInsert(mainContext.databaseConnexion.service(), parameters, mainContext.auth);
            }
            setLoading(false);
            props.hide();
        }
        catch (error: unknown) {
            mainContext.setError(error);
            setLoading(false);
            props.hide(error);
        }
    };

    return (
        <Modal show={props.entity !== undefined}>
            <Modal.Header>
                <Modal.Title>📝 Database document</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Control
                            as="textarea"
                            style={{ minHeight: "640px", fontSize: "small" }}
                            value={doc} 
                            onChange={(event: any) => setDoc(event.target.value)}
                            />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                {
                    loading
                        ? <Spinner animation="border" variant="success" />
                        : <>
                            <Button onClick={onSave}>Save</Button>
                            {
                                isDocNew
                                    ? <></>
                                    : <Button variant="danger" onClick={onDelete}>Delete</Button>
                            }
                        </>
                }
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
            </Modal.Footer>
        </Modal>

    );

}