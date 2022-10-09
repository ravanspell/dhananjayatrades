import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { addOrder } from '../services/http'

const initialState = {
    orders: [],
    order: {},
    failedOrders: [],
    loading: false,
    orderDate: ""
}

export const saveOrder = createAsyncThunk(
    'order/save',
    async (orderData) => {
        return await addOrder(orderData);
    }
)

export const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        createOrder: (state, action) => {
            const { newOrder, allOrders } = action.payload
            state.order = newOrder
            state.orders = [...allOrders, newOrder]
        },
        changeOrder: (state, action) => {
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
    setOrderDate
} = orderSlice.actions

export default orderSlice.reducer