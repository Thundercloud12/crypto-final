// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import cryptoReducer from '../store/slices/CryptoSlice';
import binanceReducer from '../store/slices/binanceSlice';

// Add debugging middleware
const debugMiddleware = (store: any) => (next: any) => (action: any) => {
  if (action.type?.startsWith('binance/')) {
    console.log('[Redux Debug] Binance Action:', {
      type: action.type,
      payload: action.payload
    });
    const result = next(action);
    console.log('[Redux Debug] Binance State After Update:', 
      store.getState().binance);
    return result;
  }
  return next(action);
};

export const store = configureStore({
  reducer: {
    crypto: cryptoReducer,
    binance: binanceReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(debugMiddleware)
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from 'react-redux';

import type { TypedUseSelectorHook } from 'react-redux';

export const useAppDispatch = () => useReduxDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
