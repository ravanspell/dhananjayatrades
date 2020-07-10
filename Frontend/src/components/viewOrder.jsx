import React, { useState, Fragment, useEffect } from "react";
import { Table, Nav, Form } from "react-bootstrap";
import SearchBox from "./itemSearchBox";
import PrintBill from "./printBill";
import PricingBox from "./priceItem";
import CancleOrder from "./cancleOrder";
import FinishOrder from "./finishOrder";
import { useSelector, useDispatch } from "react-redux";
import { createOrder } from "../actions";
import axios from "axios";

function ViewOrder(props) {
  const buttonStyles = {
    edit: {
      backgroundColor: "#1d9baecc",
      border: "none",
      width: "30px",
      borderRadius: "2px",
      color: "#e9ecef",
    },
    delete: {
      backgroundColor: "#903b3b",
      marginLeft: "3px",
      border: "none",
      width: "30px",
      borderRadius: "2px",
      color: "#e9ecef",
    },
  };
  const dispatch = useDispatch();

  /**
   * Initilize the order
   * save order data structure in browser store to offline usage.
   * http://dhananjayatrades.com/
   * http://localhost:3800/
   */
  let order = useSelector((state) => state.orderReducer.order);
  useEffect(() => {
    let finishedOrders = null;
    if (order === "") {
      order = JSON.parse(localStorage.getItem("order"));
      finishedOrders = JSON.parse(localStorage.getItem("finishOrders"));

      if (finishedOrders == null) {
        localStorage.setItem("finishOrders", "{}");
      }
      if (order == null) {
        const newOrderNumber = pickOrderNumber();
        console.log(newOrderNumber);
        initOrderData(newOrderNumber);
      } else {
        updateCounts(order);
      }
    }

    if (finishedOrders !== null) {
      const toDay = currantDate();
      const toDayOrders = finishedOrders[toDay]
        ? `{"${toDay}":${JSON.stringify(finishedOrders[toDay])}}`
        : "{}";
      delete finishedOrders[toDay];
      if (Object.keys(finishedOrders).length > 0) {
        axios
          .post("http://dhananjayatrades.com/api/orders/add", finishedOrders)
          .then((resolve) => {
            console.log(resolve.data);
            if (resolve.data.status) {
              localStorage.setItem("finishOrders", toDayOrders);
            }
          });
      }
    }
  }, []);

  const [
    { paidAmount, showEditPricingBox, editItem },
    setPaidAmount,
  ] = useState({
    paidAmount: 0,
    showEditPricingBox: false,
    editItem: {},
  });

  const setTotalPaidAmount = (value) => {
    setPaidAmount((currantState) => ({ ...currantState, paidAmount: value }));
  };

  const initOrderData = (newOrderNumber) => {
    localStorage.setItem(
      "order",
      `{"orderNo": "${newOrderNumber}", "orderItems": [], "itemsAmount": 0, "totalPrice": 0, "totalGotPrice": 0}`
    );
    dispatch(
      createOrder({
        orderNo: newOrderNumber, //data.response || data.orderNo,
        orderItems: {}, //data.orderItems ||
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
  const currantDate = () => {
    const dateObj = new Date();
    const date = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    return `${year}-${month}-${date}`;
  };

  const pickOrderNumber = () => {
    const toDay = currantDate();
    const finishedOrders = JSON.parse(localStorage.getItem("finishOrders"));
    let orderId = 0;
    while (!Boolean(orderId)) {
      let orderid = Math.floor(Math.random() * 99999);
      orderid = `${toDay}-${orderid}`;
      let orders = [];
      if (finishedOrders[toDay] != undefined)
        orders = finishedOrders[toDay].filter(
          (singleOrder) => singleOrder.orderNo === orderid
        );
      if (orders.length < 1) {
        orderId = orderid;
        return orderId;
      }
    }
  };
  const deleteOrderItem = (orderId) => {
    let currantOrder = { ...order };
    currantOrder.orderItems = currantOrder.orderItems.filter(
      (orderItem) => orderItem.id !== orderId
    );
    updateCounts(currantOrder);
  };

  const modalClose = () => {
    setPaidAmount((currantSate) => ({
      ...currantSate,
      showEditPricingBox: false,
    }));
  };

  const editOrderItem = (itemId) => {
    const foundItem = order.orderItems.find((item) => item.id == itemId);
    setPaidAmount((currantSate) => ({
      ...currantSate,
      showEditPricingBox: true,
      editItem: foundItem,
    }));
  };

  return (
    <Fragment>
      <div className="nav-scroller bg-dark-white box-shadow">
        <Nav className="mr-auto p-3 d-flex">
          <div className="row">
            <div className="col-md-6 align-middle">
              <h6>{order.orderNo} </h6>
            </div>
            <div className="col-md-6">
              <SearchBox updateorder={updateCounts} />
            </div>
          </div>
        </Nav>
      </div>

      <div class="d-flex align-content-start bd-highlight">
        <div className="my-3 flex-grow-1 p-3 bg-dark-white rounded box-shadow">
          <div className="media text-muted pt-3">
            <Table
              striped
              bordered
              hover
              size="md"
              className="text-center"
              variant="dark"
            >
              <thead>
                <tr>
                  <th>-</th>
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
                    <td>
                      <Form.Check type="checkbox" />
                    </td>
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
                        style={buttonStyles.edit}
                        onClick={(e) => {
                          editOrderItem(order.orderItems[item].id);
                        }}
                      >
                        <i className="fa fa-edit mr-2"></i>
                      </button>

                      <button
                        style={buttonStyles.delete}
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
        <div className="my-3 h-25 ml-2 p-3 bg-dark-white rounded box-shadow">
          <Table className="text-left">
            <tbody>
              <tr>
                <td>
                  <h6>Total Items</h6>
                </td>
                <td>
                  <h5>{order.itemsAmount}</h5>
                </td>
              </tr>
              <tr>
                <td>
                  <h6>Sub total</h6>
                </td>
                <td>
                  <h5>Rs.{parseFloat(order.totalPrice).toFixed(2)}</h5>
                </td>
              </tr>
              <tr>
                <td>
                  <h5>TOTAL</h5>
                </td>
                <td>
                  <h5>Rs.{parseFloat(order.totalPrice).toFixed(2)}</h5>
                </td>
              </tr>
            </tbody>
          </Table>
          <div className="d-flex flex-row">
            <PrintBill
              order={order}
              date={currantDate}
              paidamount={paidAmount}
            />
            <input
              className="form-control bg-dark-white mr-sm-1"
              placeholder="amount"
              onChange={(e) => {
                setTotalPaidAmount(e.target.value);
              }}
            />
          </div>
          <div className="d-flex flex-row mt-2">
            <FinishOrder
              currantDate={currantDate}
              initOrderData={initOrderData}
              pickOrderNumber={pickOrderNumber}
            />
          </div>
        </div>
      </div>
      <PricingBox
        show={showEditPricingBox}
        isedit={"true"}
        onHide={modalClose}
        rprice={editItem}
        // changeItemName={changeCurrantItemName}
        updateorder={updateCounts}
      />
    </Fragment>
  );
}

export default ViewOrder;
