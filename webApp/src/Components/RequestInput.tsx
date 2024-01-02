import { useContext, useEffect, useState } from "react";
import { MainContext } from "../App";
import { Button, Card, Container, Dropdown, Form, Pagination, Spinner, Stack } from "react-bootstrap";
import { RunQueryFind } from "../Controllers/RunQueries";
import DbEntity from "../Domain/DbEntity";
import { QueryFindParameters } from "../Domain/QueryParameters";
import { GetQueries } from "../Domain/GetQueries";

const DefaultLinesPerPages = 16;

const Operators = [
    '$and   And ,           sample: {"$and": { "a": "1", "b": "2"}}'.replaceAll(' ', '\xA0'),
    '$or    Or,             sample: {"$or": { "a": "0", "a": "1"}}'.replaceAll(' ', '\xA0'),
    '$in    In list,        sample: {"a" : {"$in": [ "0", "1"]}}'.replaceAll(' ', '\xA0'),
    '$eq    Equal,          sample: { "a" : null }'.replaceAll(' ', '\xA0'),
    '$ne    Not equal,      sample: { "a" : { "$ne" : null} }'.replaceAll(' ', '\xA0'),
    '$gt    Greater than,   sample: { "a"  : { "$gt" : 0} }'.replaceAll(' ', '\xA0'),
    '$lt    Less than,      sample: { "a"  : { "$lt" : 65536} }'.replaceAll(' ', '\xA0'),
]

export default function RequestInput(props: { runQuery: boolean, setRunQuery: (value: boolean) => void, setData: (data: DbEntity[]) => void }) {

    const mainContext = useContext(MainContext);

    const [loading, setLoading] = useState(false);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(DefaultLinesPerPages);

    const [queries] = useState<string[]>(GetQueries(mainContext.databaseConnexion.service()));
    const [currentQuery, setCurrentQuery] = useState(queries[0]);

    const onRun = async () => {
        mainContext.setError(undefined);
        setLoading(true);
        try {
            const parameters: QueryFindParameters = {
                repository: mainContext.databaseRepository.name,
                what: currentQuery,
                skip,
                limit
            };
            const data = await RunQueryFind(mainContext.databaseConnexion.service(), parameters, mainContext.auth);
            props.setData(data);
            setLoading(false);
        }
        catch (error: unknown) {
            mainContext.setError(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const exeQuery = async () => {
            await onRun();
            props.setRunQuery(false);
        };
        if (props.runQuery) {
            exeQuery();
        }
    },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.runQuery]);

    return (
        <Container fluid style={{ marginTop: 10 }}>
            <Card>
                <Card.Body >
                    <Stack direction="horizontal" gap={2}>
                        <Dropdown>
                            <Dropdown.Toggle variant="Light" id="dropdown-basic">🐑 Queries samples</Dropdown.Toggle>
                            <Dropdown.Menu>
                                {
                                    queries.map((query: string, index: number) =>
                                        <Dropdown.Item
                                            key={index}
                                            onClick={() => setCurrentQuery(query)}
                                            active={currentQuery === query}
                                        >
                                            {query}
                                        </Dropdown.Item>
                                    )
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                        {
                            mainContext.databaseConnexion.showOperators()
                                ? <Dropdown>
                                    <Dropdown.Toggle variant="Light" id="dropdown-basic">⚒️ Operators</Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {
                                            Operators.map((operator: string, index: number) =>
                                                <Dropdown.Item key={index}>{operator}</Dropdown.Item>
                                            )
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                                : <></>
                        }
                    </Stack>

                    <Stack direction="horizontal" gap={2}>
                        <Form.Label>{mainContext.databaseConnexion.findLabel()}</Form.Label>
                        <Form.Control as="textarea"
                            value={currentQuery}
                            onChange={(event: any) => setCurrentQuery(event.target.value)}
                        />

                        {
                            loading
                                ? <Spinner animation="border" variant="success" />
                                : <Button onClick={onRun} variant="success" >{">"}</Button>
                        }

                    </Stack>

                    <Stack direction="horizontal" gap={2}>
                        <div >
                            <Dropdown>
                                <Dropdown.Toggle variant="Light" id="dropdown-basic">{`${limit} rows per pages`}</Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => setLimit(DefaultLinesPerPages)}>{DefaultLinesPerPages}</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setLimit(DefaultLinesPerPages * 2)}>{DefaultLinesPerPages * 2}</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setLimit(DefaultLinesPerPages * 3)}>{DefaultLinesPerPages * 3}</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setLimit(DefaultLinesPerPages * 4)}>{DefaultLinesPerPages * 4}</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setLimit(DefaultLinesPerPages * 8)}>{DefaultLinesPerPages * 8}</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="ms-auto" ></div>
                        <div style={{ paddingTop: 10 }}>
                            <Pagination>
                                <Pagination.First onClick={() => {
                                    setSkip(0);
                                    onRun();
                                }} />
                                <Pagination.Prev onClick={() => {
                                    setSkip((skip - limit) > 0 ? skip - limit : 0);
                                    onRun();
                                }} />
                                <Pagination.Item disabled>{skip}</Pagination.Item>
                                <Pagination.Next onClick={() => {
                                    setSkip(skip + limit);
                                    onRun();
                                }} />
                            </Pagination>
                        </div>
                    </Stack>
                </Card.Body>
            </Card>
        </Container>
    );

}