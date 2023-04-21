import { useContext, useState } from 'react';
import { MainContext } from '../App';
import GetErrorMessage from '../Domain/GetErrorMessage';
import { Alert, Offcanvas } from 'react-bootstrap';

export default function DialogError() {

  const mainContext = useContext(MainContext);
  const [show, toggleShow] = useState(true);

  const onClose = () => {
    toggleShow(false);
    mainContext.setError(undefined);
  }

  return (
    < Offcanvas show={show} onHide={onClose} placement="bottom">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>💣 Error</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Alert variant='danger'>
          {GetErrorMessage(mainContext.error)}
        </Alert>
      </Offcanvas.Body>
    </Offcanvas >
  );
};
