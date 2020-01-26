import React, { Component } from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
import PricingBox from "./priceItem";
class Counter extends Component {
  state = {
    count: 0,
    address: {
      line1: "no272/1,Kannimahara",
      line2: "wathurugama"
    },
    list: ["list1", "list2", "list3", "list4"],
    showPricingBox: false
  };
  render() {
    return (
      <div>
        <span className="badge badge-primary m-2">{this.state.count}</span>
        <ButtonToolbar>
          <Button
            variant="primary"
            onClick={() => {
              this.incrementCount(5);
            }}
          >
            Click
          </Button>
          <PricingBox
            show={this.state.showPricingBox}
            onHide={this.modalClose}
          />
        </ButtonToolbar>
        <ul>
          {this.state.list.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    );
  }

  incrementCount = counts => {
    this.setState({ showPricingBox: true });
  };

  modalClose = () => {
    this.setState({ showPricingBox: false });
  };
}

export default Counter;
