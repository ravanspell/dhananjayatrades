import React, { useRef, useState, Fragment } from "react";
import ReactToPrint from "react-to-print";
import ComponentToPrint from "./barcodeGen";
import { Card, Input, Form, Button } from "antd";

const { TextArea } = Input;
function BarcodeGenarator() {
  const componentRef = useRef();

  const [Allbarcodes, setAllBarcodeNumbers] = useState([]);

  const generate = (data) => {
    const barcodeNumbers = data.barcodeString.split(",");
    setAllBarcodeNumbers(barcodeNumbers);
  };

  return (
    <Fragment>
      <Card>
        <Form onFinish={generate}>
          <Form.Item
            name="barcodeString"
            rules={[
              {
                required: true,
                message: "Bacodes required!",
              },
              {
                pattern: /^[0-9,]*$/,
                message: "Numbers and commas are only allowed",
              },
            ]}
          >
            <TextArea rows={5} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Genarate
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card style={{ marginTop: "10px" }}>
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
      </Card>
    </Fragment>
  );
}

export default BarcodeGenarator;
