import React, { useState, useEffect } from "react";
import { Row, Col, Input, Form, Button, message, Modal } from "antd";
import axios from "axios";
import { baseUrl } from "../services/http";

const tailLayout = {
  wrapperCol: { offset: 21, span: 16 },
};

function EditStockItem(props) {
  const [item, setNewItem] = useState({
    id: null,
    itemName: null,
    // company: "",
    amount: 0,
    cost: 0,
    // retailPrice: 0,
    // wholePrice: 0,
    price: 0,
  });
  // IIFE  for set props to state when modal open
  useEffect(() => {
    if (
      props.editdata.name !== undefined &&
      item.itemName === null &&
      props.show
    ) {
      setNewItem((currantState) => ({
        ...currantState,
        id: props.editdata.id,
        itemName: props.editdata.name,
        // company: props.editdata.company,
        amount: props.editdata.stock,
        cost: props.editdata.cost,
        // retailPrice: props.editdata.r,
        // wholePrice: props.editdata.w,
        price: props.editdata.price,
      }));
    }
  }, []);

  const saveNewItem = (newItemdata) => {
    console.log("props.editdata", props.editdata);
    newItemdata["id"] = props.editdata.id;
    console.log(' this is edited item', newItemdata);
    const editedAllData = [...props.data];
    editedAllData[props.edititemindex] = newItemdata;
    props.updatedata(editedAllData);
    axios
      .put(`${baseUrl}api/items/update`, {
        item_data: newItemdata,
      })
      .then((res) => {
        console.log(res);
        if (res.data.status) {
          message.success(res.data.message);
          closeModal();
        } else {
          message.error(res.data.message);
        }
      });
  };

  const closeModal = () => {
    props.onHide();
    setNewItem((currantState) => ({
      ...currantState,
      itemName: null,
    }));
  };

  const onCancle = () => {
    props.onHide();
  };
  return (
    <Modal
      visible={props.show}
      style={{ top: 10 }}
      closable={false}
      destroyOnClose={true}
      onCancel={onCancle}
      footer={null}
    >
      <Row gutter={[40, 0]}>
        <Col span={24}>
          <Form onFinish={saveNewItem} initialValues={props.editdata}>
            <Form.Item
              name="name"
              label="Item Name"
              rules={[
                {
                  required: true,
                  message: "Item name required!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            {/* <Form.Item
              name="company"
              label="Company Name"
              rules={[
                {
                  required: true,
                  message: "Company name required!",
                },
                {
                  type: "string",
                  message: "Company name invalid",
                },
              ]}
            >
              <Input />
            </Form.Item> */}
            <Form.Item
              name="stock"
              label="Stock Amount"
              rules={[
                {
                  required: true,
                  message: "Stock amount required!",
                },
                {
                  pattern: /^(?=.)([+-]?([0-9]*)(\.([0-9]+))?)$/,
                  message: "Numbers are only allowed",
                },
              ]}
            >
              <Input />
            </Form.Item>
            {/* <Form.Item
              name="t"
              label="Ton Price"
              rules={[
                {
                  required: true,
                  message: "Ton Price required!",
                },
                {
                  pattern: /^(?=.)([+-]?([0-9]*)(\.([0-9]+))?)$/,
                  message: "Numbers are only allowed",
                },
              ]}
            >
              <Input />
            </Form.Item> */}

            <Form.Item
              name="price"
              label="Price"
              rules={[
                {
                  required: true,
                  message: "Retail price required!",
                },
                {
                  pattern: /^(?=.)([+-]?([0-9]*)(\.([0-9]+))?)$/,
                  message: "Numbers are only allowed",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="cost"
              label="Cost"
              rules={[
                {
                  required: true,
                  message: "Cost price required!",
                },
                {
                  pattern: /^(?=.)([+-]?([0-9]*)(\.([0-9]+))?)$/,
                  message: "Numbers are only allowed",
                },
              ]}
            >
              <Input />
            </Form.Item>

            {/* <Form.Item
              name="got_price"
              label="Got Price"
              rules={[
                {
                  required: true,
                  message: "Got price required!",
                },
                {
                  pattern: /^(?=.)([+-]?([0-9]*)(\.([0-9]+))?)$/,
                  message: "Numbers are only allowed",
                },
              ]}
            >
              <Input />
            </Form.Item> */}
            <Form.Item {...tailLayout}>
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

export default EditStockItem;
