import React, { useState, Fragment } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
function NewItemSave() {
  const [newItem, setNewItem] = useState({
    barcode: null,
    itemName: null,
    company: null,
    amount: 0,
    tonPrice: 0,
    retailPrice: 0,
    wholePrice: 0,
    gotPrice: 0,
  });

  const setbarcode = (value) => {
    setNewItem((currantState) => ({
      ...currantState,
      barcode: value,
    }));
  };

  const setItemName = (value) => {
    setNewItem((currantState) => ({
      ...currantState,
      itemName: value,
    }));
  };
  const setCompany = (value) => {
    setNewItem((currantState) => ({
      ...currantState,
      company: value,
    }));
  };
  const setAmount = (value) => {
    setNewItem((currantState) => ({
      ...currantState,
      amount: value,
    }));
  };
  const setTonPrice = (value) => {
    setNewItem((currantState) => ({
      ...currantState,
      tonPrice: value,
    }));
  };

  const setRetailPrice = (value) => {
    setNewItem((currantState) => ({
      ...currantState,
      retailPrice: value,
    }));
  };

  const setWholePrice = (value) => {
    setNewItem((currantState) => ({
      ...currantState,
      wholePrice: value,
    }));
  };

  const setGotPrice = (value) => {
    setNewItem((currantState) => ({
      ...currantState,
      wholePrice: value,
    }));
  };
  //http://dhananjayatrades.com/ http://localhost:3800/
  const saveNewItem = (event) => {
    event.preventDefault();
    axios
      .post("http://dhananjayatrades.com/api/items/save", newItem)
      .then((res) => {
        console.log(res);
        if (res.data.status) {
          alert(res.data.message);
        } else {
          alert(res.data.message);
        }
        console.log(res);
      });
  };

  return (
    <Fragment>
      <div className="nav-scroller bg-white box-shadow mt-3">
        <div className="p-5">
          <Form onSubmit={saveNewItem}>
            <Form.Group controlId="formBasicText">
              <Form.Control
                type="text"
                placeholder="Barcode"
                onChange={(e) => setbarcode(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicCustomItemName">
              <Form.Control
                type="text"
                placeholder="Item Name"
                onChange={(e) => setItemName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicCustomValue">
              <Form.Control
                type="text"
                placeholder="Company"
                onChange={(e) => setCompany(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicAmount">
              <Form.Control
                type="text"
                placeholder="Amount"
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicAmount">
              <Form.Control
                type="text"
                placeholder="Ton Price"
                onChange={(e) => setTonPrice(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicAmount">
              <Form.Control
                type="text"
                placeholder="Retail Price"
                onChange={(e) => setRetailPrice(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicAmount">
              <Form.Control
                type="text"
                placeholder="Whole Price"
                onChange={(e) => setWholePrice(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicAmount">
              <Form.Control
                type="text"
                placeholder="Got Price"
                onChange={(e) => setGotPrice(e.target.value)}
              />
            </Form.Group>
            <div className="text-right">
              <Button variant="primary" type="submit">
                Save
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Fragment>
  );
}

export default NewItemSave;
