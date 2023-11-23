import React from "react";
import { Row, Col, Modal, Button, Form, Input } from "antd";
import md5 from 'md5';

function DeleteConfirm(props) {

    const [form] = Form.useForm();

    const handleSubmit = (data) => {
        const { password } = data;
        if (md5(password.trim()) === '1f41354c6b34ff23c23a958d5a9c56e2') {
            props.handleConfirmDelete();
            props.handleClose();
            form.resetFields();
        } else {
            form.setFields([
                {
                    name: 'password',
                    errors: ['Password incorrect! Try again!'],
                },
            ]);
        }
    };

    return (
        <Modal
            title={"Confirm Delete!"}
            visible={props.show}
            closable={true}
            destroyOnClose={true}
            onOk={props.onHide}
            onCancel={props.handleClose}
            footer={null}
        >
            <Row gutter={[40, 0]}>
                <Col span={24}>
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        initialValues={{
                            password: '',
                        }}
                    >
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Password required!",
                                },
                            ]}
                        >
                            <Input type="password" placeholder="Enter password" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Confirm Delete
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </Modal>
    );
}

export default DeleteConfirm;
