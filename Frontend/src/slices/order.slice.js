import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { addOrder } from '../services/http'
import moment from 'moment';

const initialState = {
    orders: [],
    order: {},
    failedOrders: [],
    loading: false,
    orderDate: "",
}

export const saveOrder = createAsyncThunk(
    'order/save',
    async (orderData) => {
        return await addOrder(orderData);
    }
)

const createOrderTemplate = (orderNumber, cust, orderType = 'dinein') => {
    const customer =  { phone: '', name: '' }
    customer.name = cust.name;
    customer.phone = cust.phone;

    return {
        orderNo: orderNumber,
        orderItems: [],
        itemsAmount: 0,
        totalPrice: 0,
        totalGotPrice: 0,
        // active | pending | done
        status: 'active',
        customer,
        // takeway | dinein
        type: orderType,
        orderTime: moment().format('HH:mm')
    }
}

const pickOrderNumber = (allOrders) => {
    const dateObj = new Date();
    const date = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear().toString();

    let orderId = 0;
    while (true) {
        let randomNumber = Math.floor(Math.random() * 9999);
        orderId = `${year.slice(year.length - 2)}${month}${date}${randomNumber}`;
        // check wether order id unique or not.
        const isOrderIdAvailable = allOrders.some((odr) => odr.orderNo === orderId)
        if (!isOrderIdAvailable) {
            break;
        }
    }
    return orderId;
};

export const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        createOrder: (state, action) => {
            const { allOrders, customer, orderType } = action.payload

            const newOrderNumber = pickOrderNumber(allOrders);
            const newOrder = createOrderTemplate(newOrderNumber, customer, orderType);
            // set pending for previous active order
            for (let i = 0; i < allOrders.length; i++) {
                const order = allOrders[i];
                if (order.status === 'active') {
                    order.status = 'pending';
                    break;
                }
            }
            state.order = newOrder
            state.orders = [...allOrders, newOrder]
        },
        changeOrder: (state, action,) => {
            const { order, orders } = action.payload
            state.order = order
            state.orders = orders
        },
        updateOrder: (state, action) => {
            const { order, orders } = action.payload
            if (order !== null) {
                state.order = order
            }
            if (orders !== null) {
                state.orders = orders
            }
        },
        addFailedOrders: (state, action) => {
            state.failedOrders = action.payload
        },
        setOrderDate: (state, action) => {
            state.orderDate = action.payload
        },
    },

    extraReducers: builder => {

        builder.addCase(saveOrder.pending, (state) => {
            state.loading = true
        });

        builder.addCase(saveOrder.fulfilled, (state, action) => {
            const { token, username, id } = action.payload.data
            state.loading = false
            state.authToken = token
            state.user = username
            state.id = id
        });

        builder.addCase(saveOrder.rejected, (state) => {
            state.loading = false
        });
    }
})

// Action creators are generated for each case reducer function
export const {
    createOrder,
    changeOrder,
    updateOrder,
    addFailedOrders,
    setOrderDate,
} = orderSlice.actions

export default orderSlice.reducer