import React, { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createOrder } from "../actions";

function CancleOrder() {
  const dispatch = useDispatch();
  const orderNo = useSelector((state) => state.orderReducer.order.orderNo);
  const CancleOrder = () => {
    localStorage.setItem(
      "order",
      `{"orderNo":${orderNo}, "orderItems": [], "itemsAmount": 0, "totalPrice": 0, "totalGotPrice": 0}`
    );

    dispatch(
      createOrder({
        orderNo: orderNo,
        orderItems: {},
        itemsAmount: 0,
        totalPrice: 0,
      })
    );
  };
  return (
    <Fragment>
      <button type="button" onClick={CancleOrder} className="btn btn-dark">
        <i className="fa fa-close">
          <span className="ml-1">Cancle Order</span>
        </i>
      </button>
    </Fragment>
  );
}

export default CancleOrder;
