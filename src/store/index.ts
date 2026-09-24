import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import generatorReducer from './slices/generatorSlice';
import sparePartsReducer from './slices/sparePartsSlice';
import orderReducer from './slices/orderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    generators: generatorReducer,
    spareParts: sparePartsReducer,
    orders: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
