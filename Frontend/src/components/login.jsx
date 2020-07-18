import React, { Fragment, useState } from "react";

import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, verifyUser } from "../actions";
import axios from "axios";
import { Row, Form, Input, Button, Checkbox, message, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { sendLogin } from "../services/http";
function Login(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const loginForm = (userData) => {
    setLoading(true);
    sendLogin(userData)
      .then((response) => {
        if (response.data.status) {
          axios.interceptors.request.use((config) => {
            config.headers.authorization = `Bearer ${response.data.token}`;
            return config;
          });
          dispatch(login(response.data.token));
          dispatch(verifyUser(response.data.username));
          setLoading(false);
          history.push("/");
        } else {
          setLoading(false);
          message.error(response.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        message.error(error.message);
      });
  };
  //<img className="logo" src="img/logo.png" alt="" />
  return (
    <Fragment>
      <Card>
        <Row
          type="flex"
          justify="center"
          align="middle"
          style={{ minHeight: "100vh" }}
        >
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={loginForm}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loading={loading}
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Row>
      </Card>
    </Fragment>
  );
}
export default Login;
