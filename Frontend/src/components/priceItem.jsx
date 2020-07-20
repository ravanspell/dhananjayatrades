import React, { useState, useEffect } from "react";
import { Row, Col, Modal, Button, Form, Input, Select } from "antd";
import { uuid } from "uuidv4";

function PricingBox(props) {
  // const [form] = Form.useForm();
  console.log(props.rprice);
  const [{ priceType, item }, setLocalState] = useState({
    priceType: "tPrice",
    item: props.rprice,
  });

  useEffect(() => {
    // form.resetFields();
    setLocalState((currantState) => ({
      ...currantState,
      item: props.rprice,
    }));
  }, [props.rprice]);

  const changeCurrantItemName = (newName) => {
    let newCurrantItem = { ...item };
    newCurrantItem.value = newName;
    setLocalState((currantSate) => ({
      ...currantSate,
      item: newCurrantItem,
    }));
  };
  const handleSubmit = (data) => {
    let order = JSON.parse(localStorage.getItem("order"));
    let newItem = {
      itemName: data.customItemname || item.itemName,
      customPrice: parseFloat(data.customPrice) || 0,
      amount: data.itemAmount,
      unitPrice: parseFloat(
        data.customPrice || item[data.priceType || priceType]
      ),
      gotPrice: parseFloat(item.gotPrice),
      tPrice: parseFloat(item.tPrice),
      rPrice: parseFloat(item.rPrice),
      wPrice: parseFloat(item.wPrice),
      orderId: order.orderNo,
      total: parseFloat(
        (data.customPrice || item[data.priceType || priceType]) *
          data.itemAmount
      ),
    };
    if (props?.isedit == "true") {
      const itemPlace = order.orderItems.findIndex(
        (orderItem) => orderItem.id == item.id
      );
      newItem.id = item.id;
      newItem.barcode = item.barcode;
      order.orderItems[itemPlace] = newItem;
    } else {
      newItem["id"] = uuid();
      newItem["barcode"] = item.id;
      order.orderItems.push(newItem);
    }
    props.updateorder(order);
    setLocalState((currantState) => ({
      ...currantState,
      customPrice: 0,
      customItemName: "",
      priceType: "tPrice",
    }));
    // form.resetFields();
    props.onHide();
  };

  return (
    <Modal
      title={item.value || item.itemName || ""}
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
            // form={form}
            onFinish={handleSubmit}
            initialValues={{
              priceType: "tPrice",
              customItemname: props.rprice.value || item.itemName || "",
            }}
          >
            <Form.Item name="priceType">
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
            </Form.Item>
            <Form.Item name="customItemname">
              <Input onChange={(e) => changeCurrantItemName(e.target.value)} />
            </Form.Item>
            <Form.Item
              name="customPrice"
              rules={[
                {
                  pattern: /^[0-9-.]*$/,
                  message: "Numbers are only allowed",
                },
              ]}
            >
              <Input placeholder="custom price" value={0} />
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
