import React, { useEffect } from "react";
import { Row, Col, Modal, Button, Form, Input, Radio } from "antd";
import { useSelector } from "react-redux";
import { BOTH, DINE_IN, TAKE_WAY } from "../constants";
import { deepCopy } from "../utils";

const {TextArea} = Input;

function PricingBox(props) {

    const currentOrder = useSelector((state) => state.orders.order);
    // const [{ item }, setLocalState] = useState({
    //     item: props.item,
    // });

    const [form] = Form.useForm();

    useEffect(() => {
        console.log('props.item', props.item);
        // setLocalState((currantState) => ({
        //     ...currantState,
        //     item: deepCopy(props.item),
        // }));
        form.resetFields();
    }, [props.item]);

    // const changeCurrantItemName = (newName) => {
    //     let newCurrantItem = { ...item };
    //     newCurrantItem.value = newName;
    //     setLocalState((currantSate) => ({
    //         ...currantSate,
    //         item: newCurrantItem,
    //     }));
    // };

    const handleSubmit = (data) => {
        const order = deepCopy(currentOrder)
        const item = deepCopy(props.item)
        console.log('item', item)
        let newItem = {
            ...item,
            // itemName: data.customItemname || item.itemName,
            customPrice: parseFloat(data.customPrice) || 0,
            amount: data.itemAmount,
            unitPrice: parseFloat(
                data.customPrice || item.unitPrice,
            ),
            // gotPrice: parseFloat(item.cost),
            // tPrice: parseFloat(item.tPrice),
            // rPrice: parseFloat(item.rPrice),
            // wPrice: parseFloat(item.wPrice),
            // orderId: order.orderNo,
            total: parseFloat(
                (data.customPrice || item.unitPrice) *
                data.itemAmount
            ),
            type: data.orderType,
            note: data?.note
        };
        // if (props?.isedit == "true") {
        const itemPlace = order.orderItems.findIndex(
            (orderItem) => orderItem.id == item.id
        );
        // newItem.id = item.id;
        // newItem.barcode = item.barcode;
        order.orderItems[itemPlace] = newItem;
        //} 

        // else {
        //     newItem["id"] = uuid();
        //     newItem["barcode"] = item.id;
        //     order.orderItems = [...order.orderItems, newItem];
        // }
        props.updateorder(order);
        // setLocalState((currantState) => ({
        //     ...currantState,
        //     customPrice: 0,
        //     customItemName: "",
        //     priceType: "tPrice",
        // }));
        // form.resetFields();
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
                            // priceType: "tPrice",
                            // customItemname: props.item.value || item.itemName || props.item.itemName || "",
                            orderType: props.item?.type,
                            itemAmount: props.item?.amount,
                            note: props.item?.note
                        }}
                    >
                        {/* <Form.Item name="priceType">
                            <Select>
                                <Select.Option value="tPrice">
                                    Ton Price Rs {item.tPrice || ""}
                                </Select.Option>
                                <Select.Option value="wPrice">
                                    Whole Price Rs {item.wPrice || ""}
                                </Select.Option>
                                <Select.Option value="rPrice">
                                    Retail Price Rs {item.rPrice || ""}
                                </Select.Option>
                            </Select>
                        </Form.Item> */}
                        {/* <Form.Item name="customItemname">
                            <Input onChange={(e) => changeCurrantItemName(e.target.value)} />
                        </Form.Item> */}
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
