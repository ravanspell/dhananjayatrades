import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";

class PrintBill extends Component {
  handleKeyDown = e => {
    console.log(e.keyCode);
  };
  printx = () => {
    var mywindow = window.open("", "PRINT", "height=800,width=600");

    mywindow.document.write(`

        <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>Dhananjaya Trades</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script>
      <style>
          #records_table{margin:auto;}
         th{padding:10px;text-align: center;}
         td{padding:5px;text-align: center;}
      </style>
    </head>
    <body>

    <div class="container">
      <div class="row">
        <div class="col-sm-2" >
        </div>
        <div class="col-sm-8" >`);
    mywindow.document.write(document.getElementById("bill").innerHTML);
    mywindow.document.write(`</div>
    <div class="col-sm-2" >
    </div>
  </div>
</div></body></html>`);
    // mywindow.document.close(); // necessary for IE >= 10
    // mywindow.focus(); // necessary for IE >= 10*/
    //mywindow.print();
    //mywindow.close();
    return true;
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
            <h6>Bill</h6>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="row justify-content-center"
            onKeyDown={this.handleKeyDown}
          >
            <div className="col-auto">
              <div id="bill">
                <table id="records_table" border="1">
                  <thead>
                    <tr>
                      <th colSpan="3"> Dhananjaya Trade Center</th>
                      <th> Order {this.props.order?.orderNo}</th>
                    </tr>
                    <tr>
                      <th colSpan="4">
                        193/A, Diyawala, Kirindiwela
                        <br /> TP-033.2267558 Date- 31-12-2019
                      </th>
                    </tr>

                    <tr>
                      <th>Purchase</th>
                      <th style={{ width: "15%" }}>Unit Price</th>
                      <th style={{ width: "8%" }}>Qty</th>
                      <th style={{ width: "15%" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(this.props.order.orderItems || {}).map(
                      item => (
                        <tr key={this.props.order?.orderItems[item].barcode}>
                          <td>{this.props.order.orderItems[item].itemName}</td>
                          <td>
                            {this.props?.order.orderItems[item].customPrice > 0
                              ? this.props?.order.orderItems[item].customPrice
                              : this.props?.order.orderItems[item].unitPrice}
                          </td>
                          <td>{this.props?.order.orderItems[item].amount}</td>
                          <td>{this.props?.order.orderItems[item].total}</td>
                        </tr>
                      )
                    )}

                    <tr>
                      <td>{this.props?.order.itemsAmount} items</td>
                      <td colSpan="2">
                        <b> Total Cost </b>
                      </td>
                      <td>
                        <b>{this.props?.order.totalPrice}</b>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td colSpan="2">
                        <b> Cach </b>
                      </td>
                      <td>
                        <b>{this.props.paidamount}</b>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td colSpan="2">
                        <b> Balance </b>
                      </td>
                      <td>
                        <b>
                          {this.props.paidamount - this.props?.order.totalPrice}
                        </b>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="4">
                        <b> Thank You Come Again! </b>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <button onClick={this.printx}>print</button>
        </Modal.Body>
      </Modal>
    );
  }
}

export default PrintBill;
