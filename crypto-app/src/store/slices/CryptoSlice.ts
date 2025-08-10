import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Technical Analysis Interface
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

// Coin Interface
export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_24h: number;
  high_24h: number;
  low_24h: number;
  sparkline_in_7d?: { price: number[] };
  technicalAnalysis?: TechnicalIndicators;
}

export interface FetchCoinsParams {
  vsCurrency?: string;
  perPage?: number;
  page?: number;
}

// Async thunk to fetch coins data from CoinGecko
export const fetchCoins = createAsyncThunk<
  Coin[],
  FetchCoinsParams | void,
  { rejectValue: string }
>(
  'crypto/fetchCoins',
  async ({ vsCurrency = 'usd', perPage = 50, page = 1 } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get<Coin[]>(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: vsCurrency,
            order: 'market_cap_desc',
            per_page: perPage,
            page,
            sparkline: true,
          },
        }
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Analyze technical indicators
export const analyzeCrypto = createAsyncThunk(
  'crypto/analyzeCrypto',
  async (coin: { symbol: string; prices: number[] }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/analyze', {
        prices: coin.prices
      });
      return {
        symbol: coin.symbol,
        analysis: response.data
      };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// State interface
interface CryptoState {
  coins: Coin[];
  favorites: string[];  // Array of coin IDs
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: CryptoState = {
  coins: [],
  favorites: JSON.parse(localStorage.getItem('cryptoFavorites') || '[]'),
  status: 'idle',
  error: null,
};

// Create slice
// Create slice
const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const coinId = action.payload;
      const index = state.favorites.indexOf(coinId);
      if (index === -1) {
        state.favorites.push(coinId);
      } else {
        state.favorites.splice(index, 1);
      }
      localStorage.setItem('cryptoFavorites', JSON.stringify(state.favorites));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoins.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCoins.fulfilled, (state, action: PayloadAction<Coin[]>) => {
        state.status = 'succeeded';
        state.coins = action.payload;
      })
      .addCase(fetchCoins.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Unknown error';
      })
      .addCase(analyzeCrypto.fulfilled, (state, action) => {
        const coinIndex = state.coins.findIndex(
          c => c.symbol.toLowerCase() === action.payload.symbol.toLowerCase()
        );
        if (coinIndex !== -1) {
          state.coins[coinIndex].technicalAnalysis = action.payload.analysis;
        }
      });
  },
});

// ✅ Export the action as a named export
export const { toggleFavorite } = cryptoSlice.actions;

// ✅ Export reducer as default
export default cryptoSlice.reducer;


