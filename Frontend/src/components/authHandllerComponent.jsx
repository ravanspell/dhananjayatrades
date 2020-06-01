import React, { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createOrder } from "../actions";
import axios from "axios";

function CancleOrder(props) {
  const dispatch = useDispatch();
  const orderNo = useSelector(
    (state) => state.userAuthReducer.userState.authToken
  );

  useEffect(() => {
    if (!orderNo) props.history.push("/login");
  }, []);
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
