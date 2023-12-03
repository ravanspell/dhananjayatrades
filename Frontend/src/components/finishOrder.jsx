import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllItems } from "../slices/items.slice";
import { addFailedOrders, saveOrder, updateOrder } from "../slices/order.slice";
import moment from 'moment';
import { getServiceCharge } from "../utils";
import { Popconfirm } from 'antd';

const FinishOrder = (props) => {
  const dispatch = useDispatch();

  let order = useSelector((state) => state.orders.order);
  let failedOrders = useSelector((state) => state.orders.failedOrders);

  const getFailedOrders = () => {
    return JSON.parse(JSON.stringify(failedOrders))
  }

  const saveFailedOrder = (order) => {
    const failedOrders = getFailedOrders();
    failedOrders.push(order)
    dispatch(addFailedOrders(failedOrders))
  }

  const processOrderAsync = async (currentOrder) => {
    try {
      // const failedOrders = getFailedOrders();
      
      let orders = [
        currentOrder
      ]
      await dispatch(saveOrder(orders)).unwrap();
      
      dispatch(getAllItems());
    } catch (error) {
      saveFailedOrder(order)
    }
  }
  const finishOrder = async () => {
    if (order.orderItems.length > 0) {
      props.setTotalPaidAmount(0);
      const allOrders = props.getAllOrders()
      const alteredOrderData = allOrders.map((odr) => {
        if (odr.orderNo === order.orderNo) {
          return { orderNo: odr.orderNo, status: 'done' }
        }
        return odr
      })
      try {
        // props.initOrderData(alteredOrderData);
        const serviceCharge = getServiceCharge(order);
        const orderData = {
          ...order,
          date: moment().format(),
          total: order.total + serviceCharge,
          serviceCharge,
        }
        dispatch(updateOrder({ order: {}, orders: alteredOrderData }));
        processOrderAsync(orderData)
      } catch (error) {
        saveFailedOrder(order)
      }
    }
  };

  return (
    <Fragment>
      <Popconfirm
        title="Submit order!"
        description="Are you sure to submit this order?"
        onConfirm={finishOrder}
        okText="Yes"
        cancelText="No"
      >
        <button type="button" className="finish-order-btn">
          <i className="fa fa-check">
            <span className="ml-1">Finish Order</span>
          </i>
        </button>
      </Popconfirm>
    </Fragment>
  );
}

export default FinishOrder;
