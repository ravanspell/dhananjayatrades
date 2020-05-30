import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";

function EditStockItem(props) {
  const [item, setNewItem] = useState({
    itemName: null,
    company: "",
    amount: 0,
    tonPrice: 0,
    retailPrice: 0,
    wholePrice: 0,
    gotPrice: 0,
  });
  // IIFE  for set props to state when modal open
  (() => {
    if (
      props.editdata.name != undefined &&
      item.itemName === null &&
      props.show
    ) {
      setNewItem((currantState) => ({
        ...currantState,
        itemName: props.editdata.name,
        company: props.editdata.company,
        amount: props.editdata.stock,
        tonPrice: props.editdata.t,
        retailPrice: props.editdata.r,
        wholePrice: props.editdata.w,
        gotPrice: props.editdata.got_price,
      }));
    }
  })();

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
      gotPrice: value,
    }));
  };
  //http://dhananjayatrades.com/
  const saveNewItem = (event) => {
    event.preventDefault();
    let editedData = {
      barcode: props.editid,
      name: item.itemName,
      got_price: parseFloat(item.gotPrice),
      t: parseFloat(item.tonPrice),
      w: parseFloat(item.wholePrice),
      r: parseFloat(item.retailPrice),
      stock: parseInt(item.amount),
      company: item.company,
    };
    const editedAllData = [...props.data];
    editedAllData[props.edititemindex] = editedData;
    props.updatedata(editedAllData);
    axios
      .put("http://localhost:3800/api/items/update", {
        barcode: props.editid,
        item_data: item,
      })
      .then((res) => {
        console.log(res);
        if (res.data.status) {
          closeModal();
          // alert(res.data.message);
        } else {
          alert(res.data.message);
        }
        console.log(res);
      });
  };

  const closeModal = () => {
    props.onHide();
    setNewItem((currantState) => ({
      ...currantState,
      itemName: null,
    }));
  };
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <h6>Edit Item</h6>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={saveNewItem}>
          <Form.Group>
            <Form.Label>Item Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Item Name"
              value={item.itemName || ""}
              onChange={(e) => setItemName(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Company</Form.Label>
            <Form.Control
              type="text"
              placeholder="Company"
              value={item.company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Stock Amount</Form.Label>
            <Form.Control
              type="text"
              placeholder="Amount"
              value={item.amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Ton Price</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ton Price"
              value={item.tonPrice}
              onChange={(e) => setTonPrice(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Retail Price</Form.Label>
            <Form.Control
              type="text"
              placeholder="Retail Price"
              value={item.retailPrice}
              onChange={(e) => setRetailPrice(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Whole Price</Form.Label>
            <Form.Control
              type="text"
              placeholder="Whole Price"
              value={item.wholePrice}
              onChange={(e) => setWholePrice(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Got Price</Form.Label>
            <Form.Control
              type="text"
              placeholder="Got Price"
              value={item.gotPrice}
              onChange={(e) => setGotPrice(e.target.value)}
            />
          </Form.Group>
          <div className="text-right">
            <Button className="mr-2" onClick={props.onHide}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditStockItem;
