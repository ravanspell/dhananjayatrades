import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Modal, Button, Form, Tag, Input, Radio } from "antd";
import { debounce } from 'lodash';
import { useDispatch, useSelector } from "react-redux";
import SearchInput from "./searchInput";
import { searchCustomer } from "../services/http";
import { saveCustomer } from "../slices/customer.slice";
import { StatusCodes } from 'http-status-codes';
import { createOrder } from "../slices/order.slice";
import { BOTH, DINE_IN, TAKE_WAY } from "../constants";
import { deepCopy } from "../utils";


const StartOrderModal = (props) => {

    const { loading } = useSelector((state) => state.customers);
    const allOrders = useSelector((state) => state.orders.orders);
    const currentOrder = useSelector((state) => state.orders.order);
    // to focus filed when modal open
    const phoneFieldRef = useRef();

    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const [isNewUser, setIsNewUser] = useState(false);
    const [searchedCustomers, setSearchedCustomers] = useState([]);
    const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);

    useEffect(() => {
        if (phoneFieldRef.current && props.show) {
            phoneFieldRef.current.focus();
        }
    }, [props.show]);

    const handleSearchDebounce = debounce(async (value) => {
        setIsLoadingCustomers(true);
        const { data } = await searchCustomer(value) || [];
        if (data?.data) {
            if (data?.data.length > 0) {
                setSearchedCustomers((data?.data || []).map((item) => (
                    { value: item.phone, label: `${item.phone}-${item.name}`, name: item.name }
                )));
            } else {
                setSearchedCustomers([{ value: value, label: value, new: true }]);
            }
        }
        setIsLoadingCustomers(false);
    }, 1000);

    const handleSubmit = async (data) => {
        const customerData = {
            phone: data.phoneNo,
            name: data.name
        }
        if (isNewUser) {
            await dispatch(saveCustomer(customerData)).unwrap();
        }

        dispatch(createOrder({
            allOrders: deepCopy(allOrders),
            customer: deepCopy(customerData),
            orderType: data.orderType,
        }))
        props.onHide()
    }

    const modalTitle = (itemName, sotck) => {
        return (<div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            <div>
                {itemName}
            </div>
            <div>
                <Tag>Stock: {sotck}</Tag>
            </div>
        </div>
        )
    }

    const onChangeCustomer = (customerId) => {
        const customer = searchedCustomers.find(customer => customer.value === customerId);
        if(customer){
            form.setFieldsValue({name: customer?.name})
        }
    }

    const handleFieldValuesChange = ([field]) => {
        if (field) {
            const [fieldName] = field.name;
            if (fieldName === 'phoneNo') {
                const customer = searchedCustomers.find((customer) => customer.value === field.value);
                if (customer?.new) {
                    setIsNewUser(true);
                    // form.setFieldsValue({ name: "", isNewUser: true })
                } else if (customer.name) {
                    setIsNewUser(false);
                    // form.setFieldsValue({ name: customer.name, isNewUser: false })
                }
            }
        }
    }

    return (
        <Modal
            title={'Start Order'}
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
                        initialValues={{
                            name: "",
                            orderType: "dinein",
                        }}
                        onFieldsChange={handleFieldValuesChange}
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            name="phoneNo"
                            rules={[
                                { required: true, message: 'Phone number is required' },
                                {
                                    pattern: /^[0-9-.]*$/,
                                    message: "Numbers are only allowed",
                                },
                            ]}
                        >
                            <SearchInput
                                isLoadingCustomers={isLoadingCustomers}
                                onSearch={handleSearchDebounce}
                                placeholder="search customer by phone"
                                options={searchedCustomers}
                                ref={phoneFieldRef}
                                onChange={onChangeCustomer}
                            />
                        </Form.Item>
                        <Form.Item
                            name="name"
                            rules={[
                                { required: isNewUser, message: 'Customer name required' },
                            ]}
                        >
                            <Input
                                placeholder="Customer's name"
                                disabled={!isNewUser}
                            />
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
                            <Button loading={loading} type="primary" htmlType="submit">
                                Next
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </Modal>
    );
}

export default StartOrderModal;
