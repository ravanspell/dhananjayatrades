import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllItems } from "../slices/items.slice";
import { addFailedOrders, saveOrder, updateOrder } from "../slices/order.slice";

function FinishOrder(props) {
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
      await dispatch(saveOrder(currentOrder)).unwrap()
      dispatch(getAllItems());
    } catch (error) {
      console.log('====================================');
      console.log('failed order', currentOrder.orderNo);
      console.log('====================================');
      saveFailedOrder(order)
    }
  }
  const finishOrder = async () => {
    if (order.orderItems.length > 0) {
      const allOrders = props.getAllOrders()
      const alteredOrderData = allOrders.map((odr) => {
        if (odr.orderNo === order.orderNo) {
          return { orderNo: odr.orderNo, status: 'done' }
        }
        return odr
      })
      try {
        props.initOrderData(alteredOrderData);
        const orderData = {
          ...order,
          date: new Date()
        }
        processOrderAsync(orderData)
      } catch (error) {
        saveFailedOrder(order)
      }
    }
  };

  return (
    <Fragment>
      <button type="button" onClick={finishOrder} className="finish-order-btn">
        <i className="fa fa-check">
          <span className="ml-1">Finish Order</span>
        </i>
      </button>
    </Fragment>
  );
}

export default FinishOrder;
