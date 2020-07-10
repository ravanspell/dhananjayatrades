import React, { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import axios from "axios";

function AuthHandller(props) {
  const history = useHistory();
  const authToken = useSelector((state) => state.userAuthReducer.authToken);
  useEffect(() => {
    if (!authToken) history.push("/order");
  }, []);
  return <Fragment>{props.children}</Fragment>;
}
export default AuthHandller;
