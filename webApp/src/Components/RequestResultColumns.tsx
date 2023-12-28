import { Button, Dropdown, SplitButton } from "react-bootstrap";
import DbDocument from "../Domain/DbDocument";
import { useState } from "react";
import { CSVLink } from "react-csv";

export interface DrawGrid {
    columnsViewed: string[] | undefined;
    columnsDate: string[] | undefined;
    columnsOrder: string[] | undefined
}

export default function RequestResultColumns(props: {
    data: DbDocument[],
    setDrawGrid: (value: DrawGrid) => void
}) {
    if (props.data.length < 1) {
        throw new Error("No data provided")
    }
    const columnsName = Object.keys(props.data[props.data.length - 1]).sort((a: string, b: string) => a.localeCompare(b));

    const [columnsViewed, setColumnsViewed] = useState<string[]>(columnsName);

    const viewColumns = (newColumns: string[]) => {
        setColumnsViewed(newColumns);

        // Order Columns
        const addedColumnsOrder: string[] = [];
        newColumns.forEach(col => {
            if (!columnsOrder.includes(col)) {
                addedColumnsOrder.push(col);
            }
        });
        let newColumnsOrder: string[] = [];
        columnsOrder.forEach(col => {
            if (newColumns.includes(col)) {
                newColumnsOrder.push(col);
            }
        });
        if (addedColumnsOrder.length > 0) {
            // Add column
            newColumnsOrder = [
                ...columnsOrder,
                ...addedColumnsOrder
            ];
        }
        // else Remove column
        setColumnsOrder(newColumnsOrder);
        props.setDrawGrid({
            columnsViewed: newColumns,
            columnsDate,
            columnsOrder: newColumnsOrder
        });

    }
    const onViewColumn = (columnName: string): void => {
        const index = columnsViewed.indexOf(columnName);
        let newColumns: string[] = [];
        if (index >= 0) {
            newColumns = [...columnsViewed];
            newColumns.splice(index, 1);
        }
        else {
            newColumns = [
                ...columnsViewed,
                columnName
            ];
        }
        viewColumns(newColumns);
    }

    const [columnsDate, setColumnsDate] = useState<string[]>([]);

    const onColumnDateSelected = (columnName: string) => {
        const index = columnsDate.indexOf(columnName);
        let newColumns: string[] = [];
        if (index >= 0) {
            newColumns = [...columnsDate];
            newColumns.splice(index, 1);
        }
        else {
            newColumns = [
                ...columnsDate,
                columnName
            ];;
        }
        setColumnsDate(newColumns);
        props.setDrawGrid({
            columnsViewed,
            columnsDate: newColumns,
            columnsOrder
        });
    }
    const [columnsOrder, setColumnsOrder] = useState<string[]>(columnsViewed);

    const onColumnsOrderSelected = (columnName: string) => {
        const index = columnsOrder.indexOf(columnName);
        if (index > 0) {
            let newColumns = [...columnsOrder];
            const prevColumnName = newColumns[index - 1];
            newColumns[index - 1] = newColumns[index]
            newColumns[index] = prevColumnName

            setColumnsOrder(newColumns);
            props.setDrawGrid({
                columnsViewed,
                columnsDate,
                columnsOrder: newColumns,
            });
        }
    }
    const csvHeader = () => {
        return columnsViewed.map(c => ({ label: c, key: c }));
    }
    const downLoadCsv = () => {
        document.getElementById("downloadcsv")?.click();
    }

    return (
        <>
            <SplitButton variant="secondary" title="🔍 Columns viewed" autoClose="outside" >
                <Dropdown.Item onClick={() => viewColumns(columnsName)}>(All)</Dropdown.Item>
                <Dropdown.Item onClick={() => viewColumns([])}>(None)</Dropdown.Item>
                <Dropdown.Divider />
                {
                    columnsName.map((columnName: string, index: number) =>
                        <Dropdown.Item key={index}
                            onClick={() => onViewColumn(columnName)}
                            active={columnsViewed?.includes(columnName)}>{columnName}</Dropdown.Item>
                    )
                }
            </SplitButton>
            <SplitButton variant="secondary" title="🔂 Order columns" autoClose="outside" >
                <Dropdown.Item disabled>Click item to move it up</Dropdown.Item>
                <Dropdown.Divider />
                {
                    columnsOrder.map((columnName: string, index: number) =>
                        <Dropdown.Item key={index} disabled={index === 0}
                            onClick={() => onColumnsOrderSelected(columnName)}>{columnName}</Dropdown.Item>
                    )
                }
            </SplitButton>
            <SplitButton variant="secondary" title="📅 Date columns" autoClose="outside" >
                <Dropdown.Item disabled>Select columns rendered as date</Dropdown.Item>
                <Dropdown.Divider />
                {
                    columnsViewed.map((columnName: string, index: number) =>
                        <Dropdown.Item key={index}
                            onClick={() => onColumnDateSelected(columnName)}
                            active={columnsDate?.includes(columnName)}>{columnName}</Dropdown.Item>
                    )
                }
            </SplitButton>
            &nbsp;
            <Button disabled={columnsName.length === 0} variant="success" onClick={downLoadCsv}>💾 Export data as csv</Button>
            <CSVLink id="downloadcsv" style={{ visibility: "hidden" }} filename="data" data={props.data} headers={csvHeader()}></CSVLink>
        </>

    );

}