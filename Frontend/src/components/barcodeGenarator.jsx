import React, { useRef, useState, Fragment } from "react";
import { useSelector } from "react-redux";
import { Form, Button } from "react-bootstrap";
import ReactToPrint from "react-to-print";
import ComponentToPrint from "./barcodeGen";

function BarcodeGenarator(props) {
  let order = useSelector((state) => state.orderReducer.order);
  const componentRef = useRef();

  const [barcodes, setBarcodeNumber] = useState("");
  const [Allbarcodes, setAllBarcodeNumbers] = useState([]);

  const generate = (e) => {
    e.preventDefault();
    if (barcodes !== "") {
      const barcodeNumbers = barcodes.split(",");
      setAllBarcodeNumbers(barcodeNumbers);
    }
  };

  return (
    <Fragment>
      <div className="my-3 flex-grow-1 p-3 bg-dark-white rounded box-shadow">
        <Form onSubmit={generate}>
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>Add item numbers Ex: 234234,234234</Form.Label>
            <Form.Control
              onChange={(e) => setBarcodeNumber(e.target.value)}
              as="textarea"
              rows="5"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Genarate
          </Button>
        </Form>
      </div>

      <div className="my-3 flex-grow-1 flex-nowrap p-3 bg-dark-white rounded box-shadow">
        <div className="flex-grow-1">
          <ReactToPrint
            trigger={() => (
              <Button variant="primary" type="button">
                Print
              </Button>
            )}
            content={() => componentRef.current}
          />
        </div>
        <ComponentToPrint Allbarcodes={Allbarcodes} ref={componentRef} />
      </div>
    </Fragment>
  );
}

export default BarcodeGenarator;
