import React, { useState, Fragment, useEffect } from "react";
import { Table, Space, Input, Popconfirm } from "antd";
import SearchBox from "./itemSearchBox";
import PrintBill from "./printBill";
import PricingBox from "./priceItem";
//import CancleOrder from "./cancleOrder";
import FinishOrder from "./finishOrder";
import { useSelector, useDispatch } from "react-redux";
import { createOrder } from "../actions";
import axios from "axios";
import { Card } from "antd";

function ViewOrder(props) {
  const [checkStrictly, setCheckStrictly] = useState(false);
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
        orderItems: [], //data.orderItems ||
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
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
  };

  return (
    <Fragment>
      <Card>
        <div className="d-flex flex-row">
          <div className="mr-1">
            <h6>{order.orderNo} </h6>
          </div>
          <div className="ml-1">
            <SearchBox updateorder={updateCounts} />
          </div>
        </div>
      </Card>

      <div className="row mt-2">
        <div className="col-md-8 pr-0">
          <Card>
            <Table
              dataSource={order.orderItems}
              rowSelection={{ ...rowSelection }}
              responsive
              pagination={false}
              columns={[
                {
                  title: "Name",
                  dataIndex: "itemName",
                  key: "itemName",
                },
                {
                  title: "Unit Price",
                  dataIndex: "unitPrice",
                  key: "unitPrice",
                },
                {
                  title: "Amount",
                  dataIndex: "amount",
                  key: "amount",
                },
                {
                  title: "Total",
                  dataIndex: "total",
                  key: "total",
                },
                {
                  title: "Action",
                  key: "action",
                  render: (text, record) => (
                    <Space size="middle">
                      <button
                        style={buttonStyles.edit}
                        onClick={(e) => {
                          editOrderItem(record.id);
                        }}
                      >
                        <i className="fa fa-edit mr-2"></i>
                      </button>

                      <Popconfirm
                        title="Remove this item ?"
                        onConfirm={(e) => deleteOrderItem(record.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <button style={buttonStyles.delete}>
                          <i className="fa fa-trash"></i>
                        </button>
                      </Popconfirm>
                    </Space>
                  ),
                },
              ]}
            />
          </Card>
        </div>
        <div className="col-md-4">
          <Card>
            <table style={{ color: "#f3f2f2" }} className="text-left">
              <tbody>
                <tr className="border-bottom border-secondary">
                  <td>
                    <h6>Total Items</h6>
                  </td>
                  <td>
                    <h5>{order.itemsAmount}</h5>
                  </td>
                </tr>
                <tr className="border-bottom border-secondary">
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
            </table>
            <div className="d-flex flex-row">
              <Input
                placeholder="amount"
                onChange={(e) => {
                  setTotalPaidAmount(e.target.value);
                }}
              />
            </div>
            <div className="d-flex flex-row mt-2">
              <PrintBill
                order={order}
                date={currantDate}
                paidamount={paidAmount}
              />
            </div>

            <div className="d-flex flex-row mt-2">
              <FinishOrder
                currantDate={currantDate}
                initOrderData={initOrderData}
                pickOrderNumber={pickOrderNumber}
              />
            </div>
          </Card>
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
