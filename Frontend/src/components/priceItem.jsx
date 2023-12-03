import React, { useEffect } from "react";
import { Row, Col, Modal, Button, Form, Input, Radio } from "antd";
import { useSelector } from "react-redux";
import { BYOB, DINE_IN, TAKE_WAY } from "../constants";
import { deepCopy } from "../utils";

const {TextArea} = Input;

function PricingBox(props) {

    const currentOrder = useSelector((state) => state.orders.order);

    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            itemAmount: props.item.amount,
            orderType: props.item.type,
            note: props.item.note,
        });
        return (() => {
            form.resetFields();
        });
    }, [props.item]);

    const handleSubmit = (data) => {
        const order = deepCopy(currentOrder)
        const item = deepCopy(props.item)
        let newItem = {
            ...item,
            customPrice: parseFloat(data.customPrice) || 0,
            amount: data.itemAmount,
            unitPrice: parseFloat(
                data.customPrice || item.unitPrice,
            ),
            total: parseFloat(
                (data.customPrice || item.unitPrice) *
                data.itemAmount
            ),
            type: data.orderType,
            note: data?.note
        };
        const itemPlace = order.orderItems.findIndex(
            (orderItem) => orderItem.id == item.id
        );
        order.orderItems[itemPlace] = newItem;
        props.updateorder(order);
        props.onHide();
    };

    const modalTitle = (itemName) => {
        return (
            <div>
                {itemName || ''}
            </div>
        )
    }

    return (
        <Modal
            title={modalTitle(props.item?.itemName)}
            visible={props.show}
            closable={false}
            destroyOnClose={true}
            onOk={props.onHide}
            onCancel={props.onHide}
            footer={null}
        >
            <Row gutter={[40, 0]}>
                <Col span={24}>
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        initialValues={{
                            orderType: "dinein",
                            itemAmount: 0,
                            note: '',
                        }}
                    >
                        <Form.Item
                            name="customPrice"
                            rules={[
                                {
                                    pattern: /^[0-9-.]*$/,
                                    message: "Numbers are only allowed",
                                },
                            ]}
                        >
                            <Input placeholder="Custom price" value={0} />
                        </Form.Item>
                        <Form.Item
                            name="itemAmount"
                            rules={[
                                {
                                    required: true,
                                    message: "Amount required!",
                                },
                                {
                                    pattern: /^[0-9-.]*$/,
                                    message: "Numbers are only allowed",
                                },
                            ]}
                        >
                            <Input placeholder="item amount" />
                        </Form.Item>

                        <Form.Item
                            name="note"
                        >
                            <TextArea rows={4} placeholder="Add item/ order special instructions" />
                        </Form.Item>
                        <Form.Item
                            name="orderType"
                        >
                            <Radio.Group size="large">
                                <Radio.Button value={DINE_IN}>Dine In</Radio.Button>
                                <Radio.Button value={TAKE_WAY}>Take Away</Radio.Button>
                                <Radio.Button value={BYOB}>BYOB</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Save
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </Modal>
    );
}

export default PricingBox;
