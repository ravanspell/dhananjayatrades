import { 
    createSlice, 
    createAsyncThunk, 
    createEntityAdapter 
} from '@reduxjs/toolkit'
import { message } from 'antd'
import { addCustomer, customers } from '../services/http'

const initialState = {
    loading: false,
}

const customersAdapter = createEntityAdapter({
    // Assume IDs are stored in a field other than `customer.id`
    selectId: (customer) => customer.id,
    // Keep the "all IDs" array sorted based on book titles
    sortComparer: (a, b) => a.id - b.id,
})

export const saveCustomer = createAsyncThunk(
    'customer/save',
    async (customerData) => {
        return await addCustomer(customerData);
    }
)

export const getCustomers = createAsyncThunk(
    'customer/get',
    async () => {
        return await customers();
    }
)

export const customerSlice = createSlice({
    name: 'customers',
    initialState: customersAdapter.getInitialState({
        ...initialState
    }),
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

        builder.addCase(saveCustomer.pending, (state) => {
            state.loading = true
        });

        builder.addCase(saveCustomer.fulfilled, (state, action) => {
            const {data} = action.payload.data
            state.loading = false
            customersAdapter.addOne(state, data);
            message.success('Customer saved')
            
        });

        builder.addCase(saveCustomer.rejected, (state) => {
            state.loading = false
            message.error('Error: customer not saved');
        });

        /**
         * customers
         */

         builder.addCase(getCustomers.pending, (state) => {
            state.loading = true
        });

        builder.addCase(getCustomers.fulfilled, (state, action) => {
            const {data} = action.payload.data
            state.loading = false
            customersAdapter.addMany(state, data);
        });

        builder.addCase(getCustomers.rejected, (state) => {
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
} = customerSlice.actions

export const {
    selectAll: selectAllCustomers,
    selectEntities: getAllCustomers,
} = customersAdapter.getSelectors(state => state.customers);

export default customerSlice.reducer