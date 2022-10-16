import { Select } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllCustomers } from '../slices/customer.slice';
import { updateOrder } from '../slices/order.slice';
const { Option } = Select;

const CustomerSearchBox = () => {
    const customers = useSelector(selectAllCustomers);
    const orders = useSelector(state => state.orders)
    const dispatch = useDispatch();

    const handleChangeValue = (customer) => {
        const currentOrder = JSON.parse(JSON.stringify(orders.order))
        const otherOrders = JSON.parse(JSON.stringify(orders.orders))

        const selectedCustomer = customer ? customer : "";
        const updatedOtherOrders = otherOrders.map((order) => {
            if (order.orderNo === currentOrder.orderNo) {
                return {
                    ...order,
                    customer: selectedCustomer,
                }
            }
            return order
        })
        dispatch(updateOrder(
            {
                order: { ...currentOrder, customer: selectedCustomer },
                orders: updatedOtherOrders
            }
        ))
    }
    return (
        <div>
            <Select
                showSearch
                style={{
                    width: 200,
                }}
                placeholder="Search to Select"
                optionFilterProp="children"
                filterOption={(input, option) => option.children.includes(input)}
                allowClear
                onChange={handleChangeValue}
                value={orders.order.customer}
            >
                {customers.map((customer) => {
                    const { id, name } = customer;
                    return (
                        <Option key={id} value={id}>{name}</Option>
                    )
                })}
            </Select>
        </div>
    );
}

export default CustomerSearchBox;