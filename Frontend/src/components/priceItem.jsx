import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { uuid } from "uuidv4";
import { useDispatch } from "react-redux";
import { createOrder } from "../actions";
function PricingBox(props) {
  const [
    { customPrice, priceType, itemAmount, item },
    setLocalState,
  ] = useState({
    customPrice: 0,
    priceType: "tPrice",
    itemAmount: 0,
    item: props.rprice,
  });

  useEffect(() => {
    setLocalState((currantState) => ({
      ...currantState,
      item: props.rprice,
    }));
  }, [props.rprice]);

  const changeCurrantItemName = (newName) => {
    let newCurrantItem = { ...item };
    newCurrantItem.value = newName;
    setLocalState((currantSate) => ({
      ...currantSate,
      item: newCurrantItem,
    }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    let order = JSON.parse(localStorage.getItem("order"));
    let newItem = {
      itemName: item.value || item.itemName,
      customPrice: parseFloat(customPrice),
      amount: itemAmount,
      unitPrice: parseFloat(item[priceType]),
      gotPrice: parseFloat(item.gotPrice),
      tPrice: parseFloat(item.tPrice),
      rPrice: parseFloat(item.rPrice),
      wPrice: parseFloat(item.wPrice),
      orderId: order.orderNo,
      total: parseFloat((customPrice || item[priceType]) * itemAmount),
    };
    if (props?.isedit == "true") {
      const itemPlace = order.orderItems.findIndex(
        (orderItem) => orderItem.id == item.id
      );
      newItem.id = item.id;
      newItem.barcode = item.barcode;
      order.orderItems[itemPlace] = newItem;
    } else {
      newItem["id"] = uuid();
      newItem["barcode"] = item.id;
      order.orderItems.push(newItem);
    }
    props.updateOrder(order);
    setLocalState((currantState) => ({
      ...currantState,
      customPrice: 0,
      customItemName: "",
      priceType: "tPrice",
    }));
    props.onHide();
  };

  const changePriceGenure = (value) => {
    setLocalState((currantState) => ({
      ...currantState,
      priceType: value,
    }));
  };

  const changeCustomPrice = (value) => {
    setLocalState((currantState) => ({
      ...currantState,
      customPrice: value,
    }));
  };

  const changeItemAmount = (value) => {
    setLocalState((currantState) => ({
      ...currantState,
      itemAmount: value,
    }));
  };

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <h6>{item.value || item.itemName}</h6>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicText">
            <select onChange={(e) => changePriceGenure(e.target.value)}>
              <option value="tPrice">Ton Price Rs {item.tPrice}</option>
              <option value="wPrice">Whole Price Rs {item.wPrice}</option>
              <option value="rPrice">Retail Price Rs {item.rPrice}</option>
            </select>
          </Form.Group>
          <Form.Group controlId="formBasicCustomItemName">
            <Form.Control
              type="text"
              value={item.value || item.itemName}
              onChange={(e) => changeCurrantItemName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formBasicCustomValue">
            <Form.Control
              type="text"
              placeholder="custom price"
              onChange={(e) => changeCustomPrice(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formBasicAmount">
            <Form.Control
              type="text"
              placeholder="amount"
              onChange={(e) => changeItemAmount(e.target.value)}
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

export default PricingBox;
