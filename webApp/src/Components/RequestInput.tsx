import { useContext, useEffect, useState } from "react";
import { MainContext } from "../App";
import { Button, Card, Dropdown, Form, Pagination, Spinner, Stack } from "react-bootstrap";
import { DefaultDbQuery } from "../AppContext";
import { RunQueryFind } from "../Controllers/RunQueries";
import DbDocument from "../Domain/DbDocument";
import { QueryFindParameters } from "../Domain/QueryParameters";

const DefaultLinesPerPages = 16;

const GetQueries = (): string[] => {
    const queries = [DefaultDbQuery];
    const count = process.env.REACT_APP_QUERIES_COUNT;
    if (count && (+count > 0)) {
        const lenght = 1 + (+count);
        for (let index = 1; index < lenght; index++) {
            const query = process.env[`REACT_APP_QUERIES_${index}`];
            if (query) {
                queries.push(query)
            }
        }
    }
    return queries;
}

const Operators = [
    '$and   And ,           sample: {"$and": { "a": "1", "b": "2"}}'.replaceAll(' ', '\xA0'),
    '$or    Or,             sample: {"$or": { "a": "0", "a": "1"}}'.replaceAll(' ', '\xA0'),
    '$in    In list,        sample: {"a" : {"$in": [ "0", "1"]}}'.replaceAll(' ', '\xA0'),
    '$eq    Equal,          sample: { "a" : null }'.replaceAll(' ', '\xA0'),
    '$ne    Not equal,      sample: { "a" : { "$ne" : null} }'.replaceAll(' ', '\xA0'),
    '$gt    Greater than,   sample: { "a"  : { "$gt" : 0} }'.replaceAll(' ', '\xA0'),
    '$lt    Less than,      sample: { "a"  : { "$lt" : 65536} }'.replaceAll(' ', '\xA0'),
]

export default function RequestInput(props: { runQuery: boolean, setRunQuery: (value: boolean) => void, setData: (data: DbDocument[]) => void }) {

    const mainContext = useContext(MainContext);
    const [currentQuery, setCurrentQuery] = useState(mainContext.mongoQuery);
    const [loading, setLoading] = useState(false);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(DefaultLinesPerPages);

    const [queries] = useState<string[]>(GetQueries());

    const onRun = async () => {
        mainContext.setError(undefined);
        setLoading(true);
        try {
            const parameters: QueryFindParameters = {
                collection: mainContext.mongoCollection,
                what: currentQuery,
                skip,
                limit
            };
            const data = await RunQueryFind(parameters, mainContext.auth);
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
        <Card>
            <Card.Header>🔍 Query</Card.Header>
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
                    <Dropdown>
                        <Dropdown.Toggle variant="Light" id="dropdown-basic">⚒️ Operators</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {
                                Operators.map((operator: string, index: number) =>
                                    <Dropdown.Item key={index}>{operator}</Dropdown.Item>
                                )
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                    <div className="ms-auto" ></div>
                    <div >
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
                    <div >
                        <Dropdown>
                            <Dropdown.Toggle variant="Light" id="dropdown-basic">{`${limit} lines per pages`}</Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setLimit(DefaultLinesPerPages)}>{DefaultLinesPerPages}</Dropdown.Item>
                                <Dropdown.Item onClick={() => setLimit(DefaultLinesPerPages * 2)}>{DefaultLinesPerPages * 2}</Dropdown.Item>
                                <Dropdown.Item onClick={() => setLimit(DefaultLinesPerPages * 3)}>{DefaultLinesPerPages * 3}</Dropdown.Item>
                                <Dropdown.Item onClick={() => setLimit(DefaultLinesPerPages * 4)}>{DefaultLinesPerPages * 4}</Dropdown.Item>
                                <Dropdown.Item onClick={() => setLimit(DefaultLinesPerPages * 8)}>{DefaultLinesPerPages * 8}</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </Stack>
                <Stack direction="horizontal" gap={2}>

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
            </Card.Body>
        </Card>
    );

}