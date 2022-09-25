import React from "react";
import { useSelector } from "react-redux";
import { getOldOrder } from "../services/http";
import { message } from 'antd';

const buttonStyles = {
  edit: {
    backgroundColor: "#1d9baecc",
    border: "none",
    width: "30px",
    borderRadius: "2px",
    color: "#e9ecef",
  },
};
const  PrintBill = (props) => {
  let order = useSelector((state) => state.orderReducer.order);

  const currantDate = () => {
    const dateObj = new Date();
    const date = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    return `${year}-${month}-${date}`;
  };

  const printOldOrder = () => {
    const hideLoading = message.loading('Processing..', 0);
    getOldOrder(props.orderId).then((result) => {
      order = {orderItems: result.data.data};
      hideLoading();
      printx();
    }).catch((error) => {
      hideLoading();
      message.error(`Error - ${error.message}`, 2.9);
    });
  }
  const printx = () => {
    let str = "";
    Object.keys(order.orderItems || {}).forEach(
      (item) =>
        (str =
          str +
          `<tr key=${order?.orderItems[item].barcode}>
          <td rowspan="1">${order.orderItems[item].itemName || order.orderItems[item].order_name}</td>
          <td>
            ${props?.orderId ? parseFloat(order.orderItems[item].unit_price).toFixed(2) : parseFloat(
              order.orderItems[item].customPrice > 0
                ? order.orderItems[item].customPrice
                : order.orderItems[item].unitPrice
            ).toFixed(2)}
          </td>
          <td>${order.orderItems[item].amount || order.orderItems[item].qty}</td>
          <td>${parseFloat(order.orderItems[item].total).toFixed(2)}</td>
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
            <th colSpan="4"> Dhananjaya Trade Center</th>
          </tr>
          <tr>
            <th colSpan="4"> ${order?.orderNo || props?.orderId}</th>
          </tr>
          <tr>
            <th colSpan="4">
              193/A, Diyawala, Kirindiwela
              <br /> TP:076-3916919 / 033-2267558 Date:${currantDate()}
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
            <td>${order.itemsAmount || order?.orderItems?.length} items</td>
            <td colSpan="2">
              <b> Total Cost </b>
            </td>
            <td>
              <b>${order?.totalPrice? order.totalPrice.toFixed(2): order.orderItems[0]?.total?.toFixed(2)}</b>
            </td>
          </tr>
          <tr>
            <td></td>
            <td colSpan="2">
              <b> Cach </b>
            </td>
            <td>
              <b>${props?.paidamount || 0}</b>
            </td>
          </tr>
          <tr>
            <td></td>
            <td colSpan="2">
              <b> Balance </b>
            </td>
            <td>
              <b>
                ${props?.paidamount ? (props.paidamount - order.totalPrice).toFixed(2): 0}
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

  if (props.orderId) {
    return (
      <button style={buttonStyles.edit} title="Edit item info" onClick={printOldOrder}>
        
         <i className="fa fa-print" />
      </button>
    );
  }
  return (
    <button onClick={printx} type="button" className="print-btn">
      <i className="fa fa-print">
        <span className="ml-1">Print Bill</span>
      </i>
    </button>
  );
}

export default PrintBill;
