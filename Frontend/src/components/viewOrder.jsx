import React, { Component, Fragment } from "react";
import { Table, Nav } from "react-bootstrap";
import SearchBox from "./itemSearchBox";
import PrintBill from "./printBill";
import Dashboard from "./dashboard";
class ViewOrder extends Component {
  state = {
    paidAmount: 0,
  };

  setTotalPaidAmount = (value) => {
    this.setState({ paidAmount: value });
  };
  deleteItemFromList = (orderId) => {
    this.props.removeOrderItem(orderId);
  };
  render() {
    return (
      <Fragment>
        <div className="nav-scroller bg-white box-shadow">
          <Nav className="mr-auto p-3 d-flex">
            <div className="row">
              <div className="col-md-2 align-middle">
                <h6>Order No: {this.props.order.orderNo} </h6>
              </div>
              <div className="col-md-3">
                <SearchBox updateOrder={this.props.updateOrder} />
              </div>
              <div className="col-md-5">
                <PrintBill
                  //show={this.state.showPricingBox}
                  //onHide={this.modalClose}
                  order={this.props.order}
                  paidamount={this.state.paidAmount}
                />
                <button type="button" className="btn btn-dark mr-3">
                  <i className="fa fa-check">
                    <span onClick={this.props.finishOrder} className="ml-1">
                      Finish Order
                    </span>
                  </i>
                </button>
                <button type="button" className="btn btn-dark">
                  <i className="fa fa-close">
                    <span className="ml-1">Cancle Order</span>
                  </i>
                </button>
              </div>

              <div className="col-md-2">
                <input
                  className="form-control mr-sm-1"
                  placeholder="amount"
                  onChange={(e) => {
                    this.setTotalPaidAmount(e.target.value);
                  }}
                />
              </div>
            </div>
          </Nav>
        </div>
        <div className="my-3 p-3 bg-white rounded box-shadow">
          <div className="row border-bottom border-gray pb-2 mb-0">
            <div className="col-md-4">
              <h6>Total Items: {this.props.order.itemsAmount}</h6>
            </div>
            <div className="col-md-4">
              <h6>Total Amount: Rs.{this.props.order.totalPrice}</h6>
            </div>
            <div className="col-md-4"></div>
          </div>
          <div className="media text-muted pt-3">
            <Table
              striped
              bordered
              hover
              className="text-center"
              variant="dark"
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Unit Price</th>
                  <th>Amount</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(this.props?.order.orderItems || {}).map(
                  (item, i) => (
                    <tr key={i}>
                      <td>{this.props?.order.orderItems[item].itemName}</td>
                      <td>
                        {this.props?.order.orderItems[item].customPrice > 0
                          ? this.props?.order.orderItems[item].customPrice
                          : this.props?.order.orderItems[item].unitPrice}
                      </td>
                      <td>{this.props?.order.orderItems[item].amount}</td>
                      <td>{this.props?.order.orderItems[item].total}</td>
                      <td className="text-center">
                        <button
                          onClick={(e) => {
                            this.deleteItemFromList(
                              this.props?.order.orderItems[item].id
                            );
                          }}
                        >
                          <i className="fa fa-edit mr-2"></i>
                        </button>

                        <button
                          onClick={(e) => {
                            this.deleteItemFromList(
                              this.props?.order.orderItems[item].id
                            );
                          }}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </Table>
          </div>
        </div>

        <Dashboard />
      </Fragment>
    );
  }
}

export default ViewOrder;
