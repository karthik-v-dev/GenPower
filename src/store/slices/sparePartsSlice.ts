import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SparePartsState, SparePart, SparePartOrderItem } from '../../types';
import { productStorageService } from '../../services/productStorage.service';

const initialState: SparePartsState = {
  parts: [],
  cart: [],
  orders: [],
  selectedPart: null,
  isLoading: false,
  error: null,
};

export const fetchSpareParts = createAsyncThunk(
  'spareParts/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const parts = productStorageService.getSpareParts();
      return parts;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const saveSparePartAsync = createAsyncThunk(
  'spareParts/save',
  async (part: SparePart, { rejectWithValue }) => {
    try {
      const saved = await productStorageService.saveSparePart(part);
      return saved;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteSparePartAsync = createAsyncThunk(
  'spareParts/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await productStorageService.deleteSparePart(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const sparePartsSlice = createSlice({
  name: 'spareParts',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<SparePartOrderItem>) => {
      const existingItem = state.cart.find((item) => item.partId === action.payload.partId);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        existingItem.totalPrice = existingItem.quantity * existingItem.unitPrice;
      } else {
        state.cart.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter((item) => item.partId !== action.payload);
    },
    updateCartQuantity: (
      state,
      action: PayloadAction<{ partId: string; quantity: number }>
    ) => {
      const item = state.cart.find((item) => item.partId === action.payload.partId);
      if (item) {
        item.quantity = action.payload.quantity;
        item.totalPrice = item.quantity * item.unitPrice;
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
    selectPart: (state, action: PayloadAction<SparePart | null>) => {
      state.selectedPart = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch parts
      .addCase(fetchSpareParts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSpareParts.fulfilled, (state, action: PayloadAction<SparePart[]>) => {
        state.isLoading = false;
        state.parts = action.payload;
      })
      .addCase(fetchSpareParts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Save part
      .addCase(saveSparePartAsync.fulfilled, (state, action: PayloadAction<SparePart>) => {
        const index = state.parts.findIndex((p) => p.id === action.payload.id);
        if (index >= 0) {
          state.parts[index] = action.payload;
        } else {
          state.parts.unshift(action.payload);
        }
      })
      // Delete part
      .addCase(deleteSparePartAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.parts = state.parts.filter((p) => p.id !== action.payload);
      });
  },
});

export const { addToCart, removeFromCart, updateCartQuantity, clearCart, selectPart } =
  sparePartsSlice.actions;
export default sparePartsSlice.reducer;
