import React, { useState, Fragment, useEffect } from "react";
import { Table, Nav } from "react-bootstrap";
import SearchBox from "./itemSearchBox";
import PrintBill from "./printBill";
import CancleOrder from "./cancleOrder";
import { useSelector, useDispatch } from "react-redux";
import { createOrder } from "../actions";
import axios from "axios";

function ViewOrder(props) {
  const dispatch = useDispatch();

  /**
   * Initilize the order
   * save order data structure in browser store to offline usage.
   */
  let order = useSelector((state) => state.orderReducer.order);
  useEffect(() => {
    if (order === "") {
      order = JSON.parse(localStorage.getItem("order"));
      console.log(order);
      if (order == null) {
        axios
          .post("http://localhost:3800/api/orders/add")
          .then((resolve) => {
            const { data } = resolve;
            initOrderData(data);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        updateCounts(order);
      }
    }
  }, []);

  const [{ paidAmount }, setPaidAmount] = useState({
    paidAmount: 0,
  });

  const setTotalPaidAmount = (value) => {
    setPaidAmount((currantState) => ({ ...currantState, paidAmount: value }));
  };

  const currantDate = () => {
    const dateObj = new Date();
    return `${dateObj.getFullYear()}-${
      dateObj.getMonth() + 1
    }-${dateObj.getDate()}`;
  };

  const initOrderData = (data) => {
    localStorage.setItem(
      "order",
      `{"orderNo":${data.response}, "orderItems": [], "itemsAmount": 0, "totalPrice": 0, "totalGotPrice": 0}`
    );
    dispatch(
      createOrder({
        orderNo: data.response || data.orderNo,
        orderItems: data.orderItems || {},
        itemsAmount: 0,
        totalPrice: 0,
      })
    );
  };

  const updateCounts = (order) => {
    let totalPrice = 0;
    let itemsAmount = 0;
    let totalGotPrice = 0;
    (order.orderItems || []).forEach((item) => {
      if (item.customPrice > 0) {
        totalPrice = totalPrice + item.customPrice * item.amount;
      } else {
        totalPrice = totalPrice + item.unitPrice * item.amount;
      }
      itemsAmount = itemsAmount + 1;
      totalGotPrice = totalGotPrice + item.gotPrice * item.amount;
    });
    order.itemsAmount = itemsAmount;
    order.totalPrice = totalPrice;
    order.totalGotPrice = totalGotPrice;
    localStorage.setItem("order", JSON.stringify(order));
    dispatch(createOrder(order));
    // return order
  };

  const finishOrder = () => {
    order["date"] = currantDate();
    axios
      .post("http://localhost:3800/api/orders/add", order)
      .then((resolve) => {
        console.log(resolve);
        const { data } = resolve;
        localStorage.clear();
        initOrderData(data);
      });
  };

  const deleteOrderItem = (orderId) => {
    let currantOrder = { ...order };
    currantOrder.orderItems = currantOrder.orderItems.filter(
      (orderItem) => orderItem.id !== orderId
    );
    updateCounts(currantOrder);
  };

  return (
    <Fragment>
      <div className="nav-scroller bg-white box-shadow">
        <Nav className="mr-auto p-3 d-flex">
          <div className="row">
            <div className="col-md-2 align-middle">
              <h6>Order No: {order.orderNo} </h6>
            </div>
            <div className="col-md-3">
              <SearchBox updateOrder={updateCounts} />
            </div>
            <div className="col-md-5">
              <PrintBill order={order} paidamount={paidAmount} />
              <button type="button" className="btn btn-dark mr-3">
                <i className="fa fa-check">
                  <span onClick={finishOrder} className="ml-1">
                    Finish Order
                  </span>
                </i>
              </button>
              <CancleOrder />
            </div>

            <div className="col-md-2">
              <input
                className="form-control mr-sm-1"
                placeholder="amount"
                onChange={(e) => {
                  setTotalPaidAmount(e.target.value);
                }}
              />
            </div>
          </div>
        </Nav>
      </div>
      <div className="my-3 p-3 bg-white rounded box-shadow">
        <div className="row border-bottom border-gray pb-2 mb-0">
          <div className="col-md-4">
            <h6>Total Items: {order.itemsAmount}</h6>
          </div>
          <div className="col-md-4">
            <h6>Total Amount: Rs.{parseFloat(order.totalPrice).toFixed(2)}</h6>
          </div>
          <div className="col-md-4"></div>
        </div>
        <div className="media text-muted pt-3">
          <Table striped bordered hover className="text-center" variant="dark">
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
              {Object.keys(order.orderItems || {}).map((item, i) => (
                <tr key={i}>
                  <td>{order.orderItems[item].itemName}</td>
                  <td>
                    {order.orderItems[item].customPrice > 0
                      ? order.orderItems[item].customPrice
                      : order.orderItems[item].unitPrice}
                  </td>
                  <td>{order.orderItems[item].amount}</td>
                  <td>{order.orderItems[item].total}</td>
                  <td className="text-center">
                    <button
                      onClick={(e) => {
                        deleteOrderItem(order.orderItems[item].id);
                      }}
                    >
                      <i className="fa fa-edit mr-2"></i>
                    </button>

                    <button
                      onClick={(e) => {
                        deleteOrderItem(order.orderItems[item].id);
                      }}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </Fragment>
  );
}

export default ViewOrder;
