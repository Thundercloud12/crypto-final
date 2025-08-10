import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Interfaces for Stock Data
export interface TechnicalIndicators {
  rsi: number;
  macd: {
    macdLine: number;
    signalLine: number;
    histogram: number;
  };
  sma: {
    short: number;
    medium: number;
    long: number;
  };
  trend: {
    direction: 'bullish' | 'bearish' | 'neutral';
    strength: number;
    description: string;
  };
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: number;
  technicalIndicators: TechnicalIndicators;
  historicalPrices: number[];
}

// State interface
interface StockState {
  stocks: Stock[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: StockState = {
  stocks: [],
  status: 'idle',
  error: null,
};

// Async thunk to fetch stock data from our backend
export const fetchStocks = createAsyncThunk<
  Stock[],
  void,
  { rejectValue: string }
>(
  'stocks/fetchStocks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Stock[]>(
        'http://localhost:5000/api/stocks'
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch stocks');
    }
  }
);

// Create slice
const stockSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        fetchStocks.fulfilled,
        (state, action: PayloadAction<Stock[]>) => {
          state.status = 'succeeded';
          state.stocks = action.payload;
        }
      )
      .addCase(fetchStocks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Unknown error';
      });
  },
});

export default stockSlice.reducer;
