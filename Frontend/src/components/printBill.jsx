import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";

class PrintBill extends Component {
  handleKeyDown = e => {
    console.log(e.keyCode);
  };
  printx = () => {
    let str = "";
    Object.keys(this.props.order.orderItems || {}).forEach(
      item =>
        (str =
          str +
          `<tr key=${this.props.order?.orderItems[item].barcode}>
          <td rowspan="1">${this.props.order.orderItems[item].itemName}</td>
          <td>
            ${
              parseFloat(this.props?.order.orderItems[item].customPrice > 0
                ? this.props?.order.orderItems[item].customPrice
                : this.props?.order.orderItems[item].unitPrice).toFixed(2)
            }
          </td>
          <td>${this.props?.order.orderItems[item].amount}</td>
          <td>${parseFloat(this.props?.order.orderItems[item].total).toFixed(2)}</td>
        </tr>`)
    );
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
        <div class="col-sm-8" >
        <table id="records_table" border="1">
        <thead>
          <tr>
            <th colSpan="3"> Dhananjaya Trade Center</th>
            <th> Order ${this.props.order?.orderNo}</th>
          </tr>
          <tr>
            <th colSpan="4">
              193/A, Diyawala, Kirindiwela
              <br /> TP-033.2267558 Date- 31-12-2019
            </th>
          </tr>

          <tr>
            <th>Purchase</th>
            <th style = 'width:15%;'>Unit Price</th>
            <th style = 'width:8%;'>Qty</th>
            <th style = 'width:15%;'>Total</th>
          </tr>
        </thead>
        <tbody>
            ${str}
            <tr>
            <td>${this.props?.order.itemsAmount} items</td>
            <td colSpan="2">
              <b> Total Cost </b>
            </td>
            <td>
              <b>${this.props?.order.totalPrice}</b>
            </td>
          </tr>
          <tr>
            <td></td>
            <td colSpan="2">
              <b> Cach </b>
            </td>
            <td>
              <b>${this.props.paidamount}</b>
            </td>
          </tr>
          <tr>
            <td></td>
            <td colSpan="2">
              <b> Balance </b>
            </td>
            <td>
              <b>
                ${this.props.paidamount - this.props?.order.totalPrice}
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
      <button onClick={this.printx} type="button" className="btn btn-dark mr-3">
        <i className="fa fa-print">
          <span className="ml-1">Print Bill</span>
        </i>
      </button>
    );
  }
}

export default PrintBill;
