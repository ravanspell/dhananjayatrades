import React, { Component } from "react";
import { Button, Modal, Form } from "react-bootstrap";
class PricingBox extends Component {
  state = {
    customPrice: 0,
    priceType: "rPrice",
    itemAmount: 0
  };
  updateOrder = orderItem => {
    this.props.updateOrder(orderItem);
  };
  handleSubmit = event => {
    event.preventDefault();
    let order = JSON.parse(localStorage.getItem("order"));
    const { rprice } = this.props;
    let newItem = {
      id: rprice.id,
      itemName: rprice.value,
      customPrice: this.state.customPrice,
      amount: this.state.itemAmount,
      price: rprice[this.state.priceType]
    };
    order.orderItems[rprice.id] = newItem;
    this.updateOrder(order);
    localStorage.setItem("order", JSON.stringify(order));
    this.setState({ customPrice: 0 });
    this.props.onHide();
  };

  changePriceGenure = event => {
    this.setState({ priceType: event.target.value });
  };

  changeCustomPrice = event => {
    this.setState({ customPrice: event.target.value });
  };

  changeItemAmount = event => {
    this.setState({ itemAmount: event.target.value });
  };

  render() {
    return (
      <Modal
        {...this.props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h6>{this.props.rprice?.value}</h6>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group controlId="formBasicText">
              <select onChange={this.changePriceGenure}>
                <option value="tPrice">
                  Ton Price Rs {this.props.rprice?.tPrice}
                </option>
                <option value="wPrice">
                  Whole Price Rs {this.props.rprice?.wPrice}
                </option>
                <option value="rPrice">
                  Retail Price Rs {this.props.rprice?.rPrice}
                </option>
              </select>
            </Form.Group>
            <Form.Group controlId="formBasicCustomValue">
              <Form.Control
                type="text"
                placeholder="custom price"
                onChange={this.changeCustomPrice}
              />
            </Form.Group>
            <Form.Group controlId="formBasicAmount">
              <Form.Control
                type="text"
                placeholder="amount"
                onChange={this.changeItemAmount}
              />
            </Form.Group>
            <div className="text-right">
              <Button className="mr-2" onClick={this.props.onHide}>
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
}

export default PricingBox;
