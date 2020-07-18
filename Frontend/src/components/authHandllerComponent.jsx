import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

function AuthHandller(props) {
  const { component: Component, ...restProps } = props;
  const authToken = useSelector((state) => state.userAuthReducer.authToken);

  return (
    <Route
      {...restProps}
      render={(routeRenderProps) =>
        authToken ? (
          <Component {...routeRenderProps} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: routeRenderProps.location },
            }}
          />
        )
      }
    />
  );
}
export default AuthHandller;
