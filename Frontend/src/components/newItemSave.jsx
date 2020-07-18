import React, { Fragment } from "react";
import { Row, Col, Input, Form, Button, message, Card } from "antd";
import { saveItem } from "../services/http";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

function NewItemSave() {
  const saveNewItem = async (newItem) => {
    try {
      const res = await saveItem(newItem);
      if (res.data.status) {
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
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
                name="barcode"
                label="Barcode"
                rules={[
                  {
                    required: true,
                    message: "Barcode required!",
                  },
                  {
                    pattern: /^[0-9]*$/,
                    message: "Numbers are only allowed",
                  },
                ]}
              >
                <Input />
              </Form.Item>

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
                name="tonPrice"
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
              </Form.Item>

              <Form.Item
                name="retailPrice"
                label="Retail Price"
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
                name="wholePrice"
                label="Whole Price"
                rules={[
                  {
                    required: true,
                    message: "Whole price required!",
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
                name="gotPrice"
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
