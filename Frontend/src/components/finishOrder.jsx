import React, { Fragment } from "react";
import { useSelector } from "react-redux";

function FinishOrder(props) {
  let order = useSelector((state) => state.orderReducer.order);
  const finishOrder = () => {
    const toDay = props.currantDate();
    let finishedOrders = JSON.parse(localStorage.getItem("finishOrders"));
    if (!finishedOrders.hasOwnProperty(toDay)) {
      finishedOrders[toDay] = [];
    }
    order["date"] = toDay;
    finishedOrders[toDay].push(order);
    localStorage.setItem("finishOrders", JSON.stringify(finishedOrders));
    localStorage.removeItem("order");
    const newOrderNumber = props.pickOrderNumber();
    props.initOrderData(newOrderNumber);
  };

  return (
    <Fragment>
      <button type="button" onClick={finishOrder} className="btn btn-dark mr-3">
        <i className="fa fa-check">
          <span className="ml-1">Finish Order</span>
        </i>
      </button>
    </Fragment>
  );
}

export default FinishOrder;
