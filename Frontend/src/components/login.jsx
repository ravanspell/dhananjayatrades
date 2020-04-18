import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import axios from "axios";

function Login(props) {
  const [credencials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const userLogin = () => {
    axios
      .post("http://localhost:3800/api/user/login", credencials)
      .then((res) => {
        console.log(res);
        if (res.data.status) {
          console.log("oprated");
          props.history.push("/page/dashboard");
        }
      });
  };

  const setUserName = (value) => {
    setCredentials((currantState) => ({
      ...currantState,
      username: value,
    }));
  };

  const setpassword = (value) => {
    setCredentials((currantState) => ({
      ...currantState,
      password: value,
    }));
  };
  return (
    <Row>
      <Col md="7" className="market p-0">
        <p>Ireshan</p>
      </Col>
      <Col md="5" className="login-parent p-0">
        <div className="d-flex align-items-center justify-content-center login">
          <div className="login-form">
            <div className="text-center">
              <img className="logo" src="../logo.png" alt="" />
            </div>
            <form>
              <div className="form-group">
                <label for="user_name">User Name</label>
                <input
                  type="text"
                  className="text-input"
                  name=""
                  onChange={(e) => setUserName(e.target.value)}
                  id="user_name"
                />
              </div>
              <div className="form-group">
                <label for="password">Password</label>
                <input
                  type="password"
                  className="text-input"
                  name=""
                  onChange={(e) => setpassword(e.target.value)}
                  id="password"
                />
              </div>
              <button
                type="button"
                onClick={userLogin}
                className="submit-button"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </Col>
    </Row>
  );
}

export default Login;
