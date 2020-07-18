import React, { Fragment } from "react";
import { Row, Card, Button } from "antd";
import { useHistory } from "react-router-dom";

const PageNotFound = () => {
  const history = useHistory();
  const goToHome = () => {
    history.push("/");
  };
  return (
    <Fragment>
      <Card>
        <Row
          type="flex"
          justify="center"
          align="middle"
          style={{ minHeight: "100vh" }}
        >
          <Row>
            <h1>Page Not Found!</h1>
          </Row>
          <Row>
            <span>
              <Button onClick={goToHome}>home</Button>
            </span>
          </Row>
        </Row>
      </Card>
    </Fragment>
  );
};

export default PageNotFound;
