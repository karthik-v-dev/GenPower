import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UnifiedOrder, UnifiedOrderStatus } from '../../types';
import { productStorageService } from '../../services/productStorage.service';

export interface OrderState {
  orders: UnifiedOrder[];
  selectedOrder: UnifiedOrder | null;
  isLoading: boolean;
  error: string | null;
  filterStatus: string;
}

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  isLoading: false,
  error: null,
  filterStatus: 'all',
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const orders = productStorageService.getOrders();
      return orders;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async (
    payload: { orderId: string; status: UnifiedOrderStatus; trackingNumber?: string },
    { rejectWithValue }
  ) => {
    try {
      const updatedOrder = await productStorageService.updateOrderStatus(
        payload.orderId,
        payload.status,
        payload.trackingNumber
      );
      return updatedOrder;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (order: UnifiedOrder, { rejectWithValue }) => {
    try {
      const savedOrder = await productStorageService.saveOrder(order);
      return savedOrder;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setFilterStatus: (state, action: PayloadAction<string>) => {
      state.filterStatus = action.payload;
    },
    selectOrder: (state, action: PayloadAction<UnifiedOrder | null>) => {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchOrders
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<UnifiedOrder[]>) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // updateOrderStatus
      .addCase(updateOrderStatus.fulfilled, (state, action: PayloadAction<UnifiedOrder>) => {
        const index = state.orders.findIndex((o) => o.id === action.payload.id);
        if (index >= 0) {
          state.orders[index] = action.payload;
        }
        if (state.selectedOrder?.id === action.payload.id) {
          state.selectedOrder = action.payload;
        }
      })
      // createOrder
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<UnifiedOrder>) => {
        state.orders.unshift(action.payload);
      });
  },
});

export const { setFilterStatus, selectOrder } = orderSlice.actions;
export default orderSlice.reducer;
