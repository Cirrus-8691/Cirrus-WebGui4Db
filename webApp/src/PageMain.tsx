import { useContext, useState } from "react";
import { MainContext } from "./App";
import ShowDatabaseConnection, { ShowConnectionInfo } from "./Components/ShowDatabaseConnection";
import RequestInput from "./Components/RequestInput";
import RequestResult from "./Components/RequestResult";
import ShowError from "./Components/ShowError";
import { NavDropdown, Navbar } from "react-bootstrap";
import ShowDatabaseRepositories from "./Components/ShowDatabaseRepositories";
import DbEntity from "./Domain/DbEntity";
import { EmptyAuth } from "./Controllers/Auth";
import DialogAbout from "./Components/DialogAbout";
import RequestResultColumns, { DrawGrid } from "./Components/RequestResultColumns";
import { DefaultDatabaseConnection, DefaultDbQuery } from "./AppContext";

export const Application = {
    name: process.env.REACT_APP_NAME,
    version: process.env.REACT_APP_VERSION
}

export interface OrderColum {
    runQuery: boolean,
    colName: string,
    asc: boolean
}

export default function PageMain() {

    const mainContext = useContext(MainContext);
    const [data, setData] = useState<DbEntity[]>([]);
    const [showAbout, setShowAbout] = useState(false);
    const [runQuery, setRunQuery] = useState(false);

    const onSignOut = () => {
        mainContext.setDatabaseConnexion(DefaultDatabaseConnection);
        mainContext.setDatabaseRepositories([""]);
        mainContext.setDatabaseRepository("");
        mainContext.setDatabaseQuery(DefaultDbQuery);
        mainContext.setAuth(EmptyAuth);
    };
    const [showInputConnection, setShowInputConnection] = useState<ShowConnectionInfo>("");
    const [drawGrid, setDrawGrid] = useState<DrawGrid>({
        columnsViewed: undefined,
        columnsDate: undefined,
        columnsOrder: undefined
    });

    return (
        <>
            <Navbar variant="dark" bg="dark" expand="lg">
                <Navbar.Toggle />
                <Navbar.Brand className="justify-center">{"🐻 " + Application.name}</Navbar.Brand>
                <Navbar.Collapse >
                    <ShowDatabaseRepositories />
                    <RequestResultColumns data={data.length > 0 ? data : [{}]} setDrawGrid={setDrawGrid} />
                </Navbar.Collapse>
                <Navbar.Collapse className="justify-content-end">
                    <NavDropdown drop='start' title={
                        <span className="text-primary">🔻👤 User&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>}>
                        <NavDropdown.Header>Signed in as:</NavDropdown.Header>
                        <NavDropdown.Item
                            onClick={() => setShowInputConnection("user")}>
                            <b>👤 {mainContext.auth.userName === "" ? "(unsigned)" : mainContext.auth.userName}</b>
                        </NavDropdown.Item>
                        <NavDropdown.Header>Database:</NavDropdown.Header>
                        <NavDropdown.Item
                            onClick={() => setShowInputConnection("database")}
                        >🛢️{mainContext.auth.dbName}</NavDropdown.Item>
                        <NavDropdown.Header>Connection:</NavDropdown.Header>
                        <NavDropdown.Item
                            onClick={() => setShowInputConnection("connection")}
                        >{mainContext.databaseConnexion.logo()} {mainContext.databaseConnexion.name()}</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item
                            onClick={() => setShowAbout(true)}>
                            About</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={onSignOut}>🚪 Sign out</NavDropdown.Item>
                    </NavDropdown>
                </Navbar.Collapse>
            </Navbar>
            <ShowDatabaseConnection show={showInputConnection} setShow={setShowInputConnection} />
            <DialogAbout show={showAbout} setShow={setShowAbout} />
            {
                mainContext.error
                    ? <ShowError />
                    : <></>
            }
            <div style={{ margin: 10 }}>
                <RequestInput setData={setData} runQuery={runQuery} setRunQuery={setRunQuery} />
                <RequestResult data={data} drawGrid={drawGrid} refreshData={() => setRunQuery(true)} />
            </div>
        </>
    );

}