import React, { Fragment, useState } from "react";
import { Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, verifyUser } from "../actions";
import axios from "axios";

function Login(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [{ username, password }, setCredentials] = useState({
    username: "",
    password: "",
  });

  const setUsername = (username) => {
    setCredentials((currantState) => ({
      ...currantState,
      username: username,
    }));
  };

  const setPassword = (password) => {
    setCredentials((currantState) => ({
      ...currantState,
      password,
    }));
  };

  const loginForm = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3800/api/user/login", { username, password })
      .then((response) => {
        if (response.data.status) {
          axios.interceptors.request.use((config) => {
            config.headers.authorization = `Bearer ${response.data.token}`;
            return config;
          });
          dispatch(login(response.data.token));
          dispatch(verifyUser(response.data.username));
          history.push("/");
        }
      })
      .catch((error) => {
        alert("Username or password incorrect");
      });
  };
  //<img className="logo" src="img/logo.png" alt="" />
  return (
    <Fragment>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-7 market p-0">
            <p>Ireshan</p>
          </div>
          <div className="col-md-5 col-sm-12 login-parent p-0">
            <div className="d-flex align-items-center justify-content-center login">
              <div className="login-form">
                <div className="text-center"></div>
                <Form onSubmit={loginForm}>
                  <Form.Group>
                    <Form.Label className="form-label">User Name</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      id="user_name"
                      className="text-input"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      required
                      type="password"
                      id="password"
                      className="text-input"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>
                  <button type="submit" className="submit-button">
                    Login
                  </button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
export default Login;
