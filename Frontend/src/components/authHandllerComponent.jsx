import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

function AuthHandller(props) {
  const { component: Component, ...restProps } = props;
  const authToken = useSelector((state) => state.user.authToken);
  const role = useSelector((state) => state.user.role);
  const userRoles = restProps.roles ? restProps.roles : []

  return (
    <Route
      {...restProps}
      render={(routeRenderProps) =>
        authToken ? (
          userRoles.includes(role) ? (
            <Component {...routeRenderProps} />
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: routeRenderProps.location },
              }}
            />
          )
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
