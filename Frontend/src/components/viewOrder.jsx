import React, { 
  useState, 
  Fragment, 
  useEffect 
} from "react";
import { 
  Table, 
  Space, 
  Input, 
  Tooltip, 
  Button, 
  Tag } from "antd";
import SearchBox from "./itemSearchBox";
import PrintBill from "./printBill";
import PricingBox from "./priceItem";
import FinishOrder from "./finishOrder";
import { useSelector, useDispatch } from "react-redux";
import { Card } from "antd";
import Hotkeys from 'react-hot-keys';
import { 
  createOrder, 
  changeOrder, 
  updateOrder, 
  setOrderDate 
} from '../slices/order.slice'
import { sendOrdersToKitchen } from "../services/http";
import StartOrderModal from "./StartOrderModal";
import { getOrderType } from "../utils";
import DeleteConfirm from "./deleteConfirm";
import NewPrintBill from "./newPrintBill";

function ViewOrder() {
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
   * Initialize the order
   * save order data structure in browser store to offline usage.
   */
  let order = useSelector((state) => state.orders.order);
  const allOrders = useSelector((state) => state.orders.orders);
  const userId = useSelector((state) => state.user.id);
  const orderDate = useSelector((state) => state.orders.orderDate);

  const [newOrder, setNewOrder] = useState({
    showDialog: false,
    user: {},
    orderType: 'dinein'
  })

  const [deleteItem, setInitDeleteItem] = useState({
    showDialog: false,
    orderId: ''
  })

  const getOrders = () => {
    return JSON.parse(JSON.stringify(allOrders))
  }

  const getCurrentOrder = () => {
    return JSON.parse(JSON.stringify(order))
  }

  const createOrderTemplate = (orderNumber) => {
    return {
      orderNo: orderNumber,
      orderItems: [],
      itemsAmount: 0,
      totalPrice: 0,
      totalGotPrice: 0,
      // active | pending | done
      status: 'active',
      customer: ""
    }
  }

  const addNewOrder = (alteredOrderData) => {
    const orders = alteredOrderData ? alteredOrderData : getOrders();

    const newOrderNumber = pickOrderNumber();
    const newOrder = createOrderTemplate(newOrderNumber);

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      if (order.status === 'active') {
        order.status = 'pending';
        break;
      }
    }
    dispatch(
      createOrder({ newOrder, allOrders: orders })
    );
  }
  useEffect(() => {
    // remove older orders
    if (orderDate !== "") {
      const today = new Date(currantDate()).getTime()
      const previousDate = new Date(orderDate).getTime()
      if (today !== previousDate) {
        const currentOrders = getOrders();
        if (currentOrders.length > 0) {
          const pendingOrders = currentOrders.filter(odr => odr.status !== 'done');
          dispatch(updateOrder({ order: null, orders: pendingOrders }))
        }
      }
    } else {
      dispatch(setOrderDate(currantDate()))
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

  const changeActiveOrder = (orderId) => {
    const orders = getOrders();
    const currentOrder = getCurrentOrder()

    const selectedOrder = orders.find((odr) => odr.orderNo == orderId)

    if (selectedOrder) {
      selectedOrder.status = 'active'

      const currentOrderId = currentOrder.orderNo;

      const updatedOrderData = orders.map(odr => {
        if (odr.orderNo === currentOrderId) {
          odr.status = 'pending'
        }

        if (odr.orderNo === selectedOrder.orderNo) {
          odr.status = 'active'
        }
        return odr
      })

      dispatch(
        changeOrder({ order: selectedOrder, orders: updatedOrderData })
      );
    }
  }


  const removeOrder = (orderId) => {
    const orders = getOrders();
    if (orders !== null) {
      const restOfOrders = orders.filter((odr) => odr.orderNo !== orderId)
      dispatch(updateOrder({ order: null, orders: restOfOrders }))
    }
  }

  const updateCounts = (order) => {
    let totalPrice = 0;
    let itemsAmount = 0;
    let totalGotPrice = 0;
    (order.orderItems || []).forEach((item) => {
      totalPrice = totalPrice + item.unitPrice * item.amount;
      itemsAmount = itemsAmount + 1;
      totalGotPrice = totalGotPrice + item.gotPrice * item.amount;
    });
    order.itemsAmount = itemsAmount;
    order.totalPrice = totalPrice;
    order.totalGotPrice = totalGotPrice;
    //const allOrders = getOrders();
    const updatedOrders = allOrders.map((odr) => {
      if (odr.orderNo === order.orderNo) {
        return order
      }
      return odr
    })
    orderUpdate({ ...order })
  };

  const orderUpdate = (order) => {
    const allOrderData = allOrders.map((odr) => {
      if (order.orderNo === odr.orderNo) {
        return order
      }
      return odr
    })
    dispatch(updateOrder({ order, orders: allOrderData }))
  }

  const currantDate = () => {
    const dateObj = new Date();
    const date = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    return `${year}-${month}-${date}`;
  };

  const pickOrderNumber = () => {
    const toDay = currantDate();
    let orderId = 0;
    while (true) {
      let randomNumber = Math.floor(Math.random() * 99999);
      orderId = `${toDay}-${userId}-${randomNumber}`;
      // check wether order id unique or not.
      const isOrderIdAvailable = allOrders.some((odr) => odr.orderNo === orderId)
      if (!isOrderIdAvailable) {
        break;
      }
    }
    return orderId;
  };
  const deleteOrderItem = (orderId) => {
    let currantOrder = getCurrentOrder();
    currantOrder.orderItems = currantOrder.orderItems.filter(
      (orderItem) => orderItem.id !== orderId
    );
    updateCounts(currantOrder);
  };

  const modalClose = () => {
    setPaidAmount((currantSate) => ({
      ...currantSate,
      showEditPricingBox: false,
      editItem: {},
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

  const updateKitchen = async () => {
    await sendOrdersToKitchen(allOrders)
  }

  return (
    <Fragment>
      <Hotkeys
        filter={(event) => {
          if (event.ctrlKey && event.key === 'm' && event.type === 'keydown') {
            addNewOrder()
          }
        }}
      />
      <Card>
        <div className="d-flex flex-row justify-content-space-between">
          <div className="mr-1">
            <h6>{order.orderNo}</h6>
          </div>
          <div className="ml-1">
            <SearchBox updateorder={updateCounts} />
          </div>
          <div className="ml-2">
            <Button
              onClick={() => setNewOrder(state => ({ ...state, showDialog: true }))}
              type="primary"
              size="middle"
            >
              New Order
            </Button>
          </div>
        </div>
      </Card>
      <div className="d-flex flex-row mt-2 flex-wrap gap-1">
        {allOrders?.length > 0 && allOrders.filter(odr => odr.status !== 'done').map((odr) => {

          return (
            <Tag
              style={{ cursor: odr.status == 'pending' ? 'pointer' : "", fontSize: '12pt', padding: '5px' }}
              color={odr.status == 'pending' ? "" : "green"}
              key={odr.orderNo}
              onClick={odr.status == 'pending' ? () => changeActiveOrder(odr.orderNo) : (() => { })}
            >
              {getOrderType(odr.type)} - {odr.customer.name} - {odr?.orderTime}
            </Tag>
          )
        })}
      </div>
      <div className="row mt-2">
        <div className="col-md-8 pr-0">
          <Card>
            <Table
              dataSource={order.orderItems}
              rowKey="id"
              rowSelection={{
                type: "checkbox",
              }}
              responsive
              pagination={false}
              columns={[
                {
                  title: "Name",
                  dataIndex: "itemName",
                  key: "itemName",
                  render: (text, record) => (
                    <div className="d-flex align-items-center">
                      {text}
                      {record.note &&
                        <div className="ml-2 mt-1">
                          <Tooltip title={record.note}>
                            <i className="fa fa-info-circle"></i>
                          </Tooltip>
                        </div>
                      }
                    </div>
                  )
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
                      <button
                        onClick={() => setInitDeleteItem({ showDialog: true, orderId: record.id })}
                        style={buttonStyles.delete}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </Space>
                  ),
                },
              ]}
            />
          </Card>
          <div style={{ marginTop: '10px', width: 'fit-content' }} >
            {/* <Button icon={<ReloadOutlined />} onClick={updateKitchen} size="large" >Update Kitchen</Button> */}
            <PrintBill order={order} paidamount={paidAmount} />
          </div>
        </div>
        <div className="col-md-4">
          <Card>
            <table style={{ color: "#f3f2f2" }} className="text-left">
              <tbody>
                <tr className="border-bottom border-secondary">
                  <td>
                    <h6>Total Items :</h6>
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
                value={paidAmount}
                onChange={(e) => {
                  setTotalPaidAmount(e.target.value);
                }}
              />
            </div>
            <div className="d-flex flex-row mt-2">
              <NewPrintBill order={order} paidamount={paidAmount} />
            </div>

            <div className="d-flex flex-row mt-2">
              <FinishOrder
                currantDate={currantDate}
                // initOrderData={addNewOrder}
                pickOrderNumber={pickOrderNumber}
                getAllOrders={getOrders}
                setTotalPaidAmount={setTotalPaidAmount}
              />
            </div>
          </Card>
        </div>
      </div>
      <PricingBox
        show={showEditPricingBox}
        isedit={"true"}
        onHide={modalClose}
        item={editItem}
        // changeItemName={changeCurrantItemName}
        updateorder={updateCounts}
      />
      <StartOrderModal
        show={newOrder.showDialog}
        onHide={() => setNewOrder(state => ({ ...state, showDialog: false }))}
        updateorder={updateCounts}
      />
      <DeleteConfirm
        show={deleteItem.showDialog}
        handleClose={() => setInitDeleteItem({ showDialog: false, orderId: '' })}
        handleConfirmDelete={() => deleteOrderItem(deleteItem.orderId)}
      />
    </Fragment>
  );
}

export default ViewOrder;
