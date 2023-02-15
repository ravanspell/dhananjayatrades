import React, { Fragment } from "react";
import { Row, Col, Input, Form, Button, Card } from "antd";
import {saveCustomer} from '../slices/customer.slice'
import { useDispatch, useSelector } from "react-redux";
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const SaveNewCustomer = () => {
    const dispatch = useDispatch()
    const loading = useSelector(state => state.customers.loading);
    const createCustomer = (customerData) => {
        dispatch(saveCustomer(customerData))
    }

    return (
        <Fragment>
            <Card>
                <Row gutter={[8, 0]}>
                    <Col span={18}>
                        <Form {...layout} onFinish={createCustomer}>
                            <Form.Item
                                name="name"
                                label="Name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Name required!",
                                    },
                                    {
                                        type: "string",
                                        message: "Name invalid",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="shopName"
                                label="Shop Name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Shop name required!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="address"
                                label="Address"
                                rules={[
                                    {
                                        required: true,
                                        message: "Address required!",
                                    },
                                    {
                                        type: "string",
                                        message: "Address invalid",
                                    },
                                ]}
                            >
                                <Input.TextArea rows={5} />
                            </Form.Item>
                            <Form.Item
                                name="contactNo"
                                label="Contact No"
                                rules={[
                                    {
                                        pattern: /^(\+?\d{1,4}[\s-])?(?!0+\s+,?$)\d{10}\s*,?$/,
                                        message: "Invalid contact number",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item {...tailLayout}>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Save
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Card>
        </Fragment>
    );
}

export default SaveNewCustomer;
