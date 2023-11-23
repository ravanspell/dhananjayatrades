import React, { Fragment, useEffect } from "react";
import { 
  Row, 
  Col, 
  Input, 
  Form, 
  Button, 
  message, 
  Card, 
  Select } from "antd";
import { saveItem } from "../services/http";
import { useState } from "react";
import { getCategories } from "../services/http";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

function NewItemSave() {
  const [catagories, setCategories] = useState([]);
  useEffect(() => {
    getCategories().then((response) => {
      setCategories(response.data.data);
    });
  }, []);
  const saveNewItem = async (newItem) => {
    try {
      const res = await saveItem(newItem);
      if (res.data.status) {
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <Fragment>
      <Card>
        <Row gutter={[8, 0]}>
          <Col span={18}>
            <Form {...layout} onFinish={saveNewItem}>
              <Form.Item
                name="itemName"
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
              <Form.Item
                name="catagory"
                label="Catagory"
                rules={[
                  {
                    required: true,
                    message: "Catagory required!",
                  },
                ]}
              >
                <Select>
                  {catagories.map((cat, i) => {
                    return (
                      <Select.Option key={i} value={cat.id}>
                        {cat.category}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                name="amount"
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
              <Form.Item
                name="price"
                label="Price"
                rules={[
                  {
                    required: true,
                    message: "Price required!",
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
                label="Cost Price"
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
              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
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

export default NewItemSave;
