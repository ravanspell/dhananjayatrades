import React, { Fragment } from "react";
import { useSelector } from "react-redux";

function FinishOrder(props) {
  let order = useSelector((state) => state.orderReducer.order);
  const finishOrder = () => {
    if (order.orderItems.length > 0) {
      const toDay = props.currantDate();
      let finishedOrders = JSON.parse(localStorage.getItem("finishOrders"));
      if (!finishedOrders.hasOwnProperty(toDay)) {
        finishedOrders[toDay] = [];
      }
      order["date"] = toDay;
      finishedOrders[toDay].push(order);
      localStorage.setItem("finishOrders", JSON.stringify(finishedOrders));
      let allOrders = JSON.parse(localStorage.getItem("order"));
      const restOfOrders = allOrders.filter((odr) => odr.orderNo !== order.orderNo);

      if(restOfOrders.length > 0) {
        localStorage.setItem("order", JSON.stringify(restOfOrders));
      }else{
        localStorage.removeItem("order");
      }
      props.initOrderData();
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
