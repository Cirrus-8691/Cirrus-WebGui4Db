import { ReactNode } from "react";
import { Button, Offcanvas } from "react-bootstrap";

export default function DialogOffCanvas(props: {
    titleButton: string;
    titleDialog: string;
    open: boolean;
    setOpen: (value: boolean) => void;
    children: ReactNode
}) {

    const handleClose = () => props.setOpen(false);
    const handleShow = () => props.setOpen(true);

    return (
        <>
            <Button variant="secondary" onClick={handleShow} className="me-2">
                {props.titleButton}
            </Button>
             
            <Offcanvas show={props.open} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{props.titleDialog}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {props.children}
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}