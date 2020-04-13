import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { createOrder } from "../actions";
function PricingBox(props) {
  // state = {
  //   customPrice: 0,
  //   priceType: "tPrice",
  //   itemAmount: 0
  // };
  const [{ customPrice, priceType, itemAmount }, setLocalState] = useState({
    customPrice: 0,
    priceType: "tPrice",
    itemAmount: 0,
  });

  const [currantItem, setCurrantItemProperties] = useState(props);

  useEffect(() => {
    setCurrantItemProperties(props);
  }, [props]);
  // updateOrder = orderItem => {
  //   this.props.updateOrder(orderItem);
  // };
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    let order = JSON.parse(localStorage.getItem("order"));
    const { rprice } = props;
    let newItem = {
      id: order.orderItems.length + 1,
      barcode: rprice.id,
      itemName: rprice.value,
      customPrice: customPrice,
      amount: itemAmount,
      unitPrice: rprice[priceType],
      gotPrice: rprice.gotPrice,
      orderId: order.orderNo,
      total: (customPrice || rprice[priceType]) * itemAmount,
    };
    order.orderItems.push(newItem);
    props.updateOrder(order);
    setLocalState((currantState) => ({
      ...currantState,
      customPrice: 0,
      customItemName: "",
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

  //render() {
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <h6>{props.rprice?.value}</h6>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicText">
            <select onChange={(e) => changePriceGenure(e.target.value)}>
              <option value="tPrice">
                Ton Price Rs {props.rprice?.tPrice}
              </option>
              <option value="wPrice">
                Whole Price Rs {props.rprice?.wPrice}
              </option>
              <option value="rPrice">
                Retail Price Rs {props.rprice?.rPrice}
              </option>
            </select>
          </Form.Group>
          <Form.Group controlId="formBasicCustomItemName">
            <Form.Control
              type="text"
              value={props.rprice?.value}
              onChange={(e) => props.changeItemName(e.target.value)}
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
//}

export default PricingBox;
