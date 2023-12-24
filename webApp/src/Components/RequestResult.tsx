import { Alert, Button, Container, Dropdown, Spinner, SplitButton, Table, ToggleButton } from "react-bootstrap";
import DbDocument from "../Domain/DbDocument";
import { DrawGrid } from "./RequestResultColumns";
import { useContext, useEffect, useState } from "react";
import DialogDbDocument from "./DialogDbDocument";
import { MainContext } from "../App";
import { QueryDeleteParameters } from "../Domain/QueryParameters";
import { RunQueryDelete } from "../Controllers/RunQueries";

export default function RequestResult(props: { drawGrid: DrawGrid, data: DbDocument[], refreshData: () => void }) {

    const mainContext = useContext(MainContext);
    const [loading, setLoading] = useState(false);

    const head = props.drawGrid.columnsOrder
        ?? (props.data && props.data.length > 0
            ? Object.keys(props.data[0])
            : []);

    const [docSelected, setDocSelected] = useState<DbDocument | undefined>(undefined);
    const [selectMode, setSelectMode] = useState<boolean>(false);
    const [checked, setChecked] = useState<Map<number, boolean>>(new Map<number, boolean>());
    const [orderColumn, setOrderColumn] = useState<string>("");
    const [orderAsc, setOrderAsc] = useState<boolean>(true);
    const selectAll = async () => {
        const allChecked = new Map<number, boolean>();
        props.data.forEach((data: DbDocument, index: number) => allChecked.set(index, true));
        setChecked(allChecked);
    };
    const onDelete = async () => {
        mainContext.setError(undefined);
        setLoading(true);
        try {
            checked.forEach(async (value: boolean, index: number) => {
                if (value) {
                    const parameters: QueryDeleteParameters = {
                        collection: mainContext.databaseRepository,
                        _id: props.data[index]._id
                    }
                    await RunQueryDelete(parameters, mainContext.auth);
                }
            });
            props.refreshData();
            setChecked(new Map<number, boolean>());
            setLoading(false);
        }
        catch (error: unknown) {
            mainContext.setError(error);
            setLoading(false);
        }
    };
    useEffect(() => {
        if (orderColumn !== undefined && orderColumn !== "") {
            if (props.drawGrid.columnsViewed?.includes(orderColumn)) {
                props.data.sort((a: DbDocument, b: DbDocument) =>
                    orderAsc
                        ? (
                            a[orderColumn] !== undefined &&
                            a[orderColumn].toString().localeCompare((b[orderColumn].toString())))
                        : (
                            b[orderColumn] !== undefined &&
                            b[orderColumn].toString().localeCompare((a[orderColumn].toString()))))
            }

        }
    },
        [orderColumn, orderAsc, props.drawGrid.columnsViewed, props.data]
    );

    return (
        <Container fluid style={{ marginTop: 10 }}>
            {
                docSelected
                    ? <DialogDbDocument document={docSelected} hide={() => {
                        setDocSelected(undefined);
                        props.refreshData();
                    }} />
                    : <></>
            }
            {
                head.length > 0
                    ? <Table responsive striped bordered hover size="sm" style={{ minHeight: "96px" }}>
                        <thead>
                            <tr>
                                <tr>
                                    <SplitButton variant="" size="sm" title={selectMode ? "☑️" : "✏️"} onClick={() => setSelectMode(!selectMode)}>
                                        {
                                            loading
                                                ? <Spinner animation="border" variant="success" />
                                                : <>
                                                    {
                                                        selectMode
                                                            ? <>
                                                                <Dropdown.Item disabled={!selectMode} onClick={onDelete}>🗑️ Delete</Dropdown.Item>
                                                                <Dropdown.Item disabled={!selectMode} onClick={selectAll}>Select (All)</Dropdown.Item>
                                                                <Dropdown.Item disabled={!selectMode} onClick={() => setChecked(new Map<number, boolean>())}>Select (None)</Dropdown.Item>
                                                            </>
                                                            : <>
                                                                <Dropdown.Item onClick={() => setDocSelected({})}>📄 New document</Dropdown.Item>
                                                            </>
                                                    }
                                                </>
                                        }
                                    </SplitButton>
                                </tr>
                                {
                                    head.map((columnName: string, index: number) =>
                                        <th key={index} onClick={() => {
                                            if (orderColumn === columnName) {
                                                setOrderAsc(!orderAsc);
                                            }
                                            else {
                                                setOrderColumn(columnName);
                                            }
                                            props.refreshData();
                                        }}>
                                            {`${orderColumn === columnName ? (orderAsc ? '🔺' : '🔻') : ''}${columnName}`}
                                        </th>)
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                props.data.map((data: DbDocument, index: number) =>
                                    <tr key={index}>
                                        <tr>
                                            {
                                                selectMode
                                                    ? <ToggleButton type="checkbox" variant="outline-primary"
                                                        checked={checked.get(index) ?? false} value={index} id={index.toString()}
                                                        onChange={() => {
                                                            const isChecked = (checked.get(index) ?? false);
                                                            checked.set(index, !isChecked);
                                                            const newMap = new Map<number, boolean>(checked);
                                                            setChecked(newMap);
                                                        }}>
                                                        {(checked.get(index) ?? false) ? "❌" : "📄"}</ToggleButton>
                                                    : <Button variant="" key={index.toString()}
                                                        onClick={() => setDocSelected(data)}>
                                                        {(data === docSelected) ? "📌" : "📝"}
                                                    </Button>
                                            }
                                        </tr>
                                        {
                                            head.map((columnName: string, index: number) =>
                                                <td key={index}>
                                                    {
                                                        props.drawGrid.columnsDate?.includes(columnName)
                                                            ? (new Date(data[columnName])).toLocaleString()
                                                            : data[columnName]
                                                    }
                                                </td>
                                            )
                                        }
                                    </tr>
                                )
                            }
                        </tbody>
                    </Table >
                    : props.data.length > 0
                        ? <Alert variant="warning">{props.data.length} data found. But no columns displayed.</Alert>
                        : <Alert variant="secondary">No data found <Button onClick={() => setDocSelected({})}>📄 New document</Button></Alert>
            }
        </Container >
    );

}