// src/pages/Home.tsx
import { useEffect, useState, useRef, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../src/store/store';
import { fetchCoins, analyzeCrypto, toggleFavorite } from '../src/store/slices/CryptoSlice';
import { openBinanceSocket } from '../src/api/binanceSocket';
import { WS_DISCONNECT } from '../src/store/slices/binanceSlice';
import { Link } from 'react-router-dom';


const MAX_POINTS = 7;
const ROWS_PER_PAGE = 5;

export default function Home() {
  const dispatch = useAppDispatch();
  const { coins, status, favorites } = useAppSelector((s) => s.crypto);

  // Search & filter state
  const [search, setSearch] = useState('');
  const [moverFilter, setMoverFilter] = useState<'all' | 'gainers' | 'losers' | 'favorites'>('all');

  // Pagination state
  const [page, setPage] = useState(1);
  const buffersRef = useRef<Record<string, number[]>>({});
  const [buffers, setBuffers] = useState<Record<string, number[]>>({});
  buffersRef.current = buffers;

  // Fetch REST once and analyze coins
  useEffect(() => {
    dispatch(fetchCoins()).then((action) => {
      if (fetchCoins.fulfilled.match(action)) {
        // Analyze each coin that has sparkline data
        action.payload.forEach((coin) => {
          if (coin.sparkline_in_7d?.price) {
            dispatch(analyzeCrypto({
              symbol: coin.symbol,
              prices: coin.sparkline_in_7d.price
            }));
          }
        });
      }
    });
  }, [dispatch]);

  // Filter & sort coins
  const filtered = useMemo(() => {
    let arr = coins.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
    );
    
    if (moverFilter === 'favorites') {
      arr = arr.filter(c => favorites.includes(c.id));
    } else if (moverFilter === 'gainers') {
      arr = arr.filter(c => c.price_change_24h > 0)
               .sort((a,b) => b.price_change_24h - a.price_change_24h);
    } else if (moverFilter === 'losers') {
      arr = arr.filter(c => c.price_change_24h <= 0)
               .sort((a,b) => a.price_change_24h - b.price_change_24h);
    }
    return arr;
  }, [coins, search, moverFilter, favorites]);

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const start = (page - 1) * ROWS_PER_PAGE;
  const pageCoins = filtered.slice(start, start + ROWS_PER_PAGE);

  // Calculate market stats
  const marketStats = useMemo(() => {
    if (!coins.length) return null;
    const totalMarketCap = coins.reduce((sum, coin) => sum + coin.market_cap, 0);
    const gainers = coins.filter(c => c.price_change_24h > 0).length;
    const losers = coins.filter(c => c.price_change_24h < 0).length;
    return { totalMarketCap, gainers, losers };
  }, [coins]);

  if (status === 'loading') {
    return (
      <div className="min-h-[50vh] flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"/>
          <p className="text-base-content/60">Loading market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Market Overview Cards */}
      {marketStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="stat bg-base-200 rounded-box shadow-md">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
            </div>
            <div className="stat-title">Total Market Cap</div>
            <div className="stat-value text-primary">${(marketStats.totalMarketCap / 1e9).toFixed(2)}B</div>
            <div className="stat-desc">Global crypto market cap</div>
          </div>
          <div className="stat bg-base-200 rounded-box shadow-md">
            <div className="stat-figure text-success">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="stat-title">Gainers</div>
            <div className="stat-value text-success">{marketStats.gainers}</div>
            <div className="stat-desc">Coins in profit</div>
          </div>
          <div className="stat bg-base-200 rounded-box shadow-md">
            <div className="stat-figure text-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 13a1 1 0 110 2H7a1 1 0 011-1v-2.586l4.293-4.293a1 1 0 011.414 0L16 9.414V7a1 1 0 011-1h2a1 1 0 010 2h-1v3a1 1 0 01-.293.707l-5 5A1 1 0 0112 13z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="stat-title">Losers</div>
            <div className="stat-value text-error">{marketStats.losers}</div>
            <div className="stat-desc">Coins at loss</div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-base-200 p-4 rounded-box shadow-md">
        <div className="form-control w-full md:w-96">
          <div className="input-group">
            <span className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by name or symbol..."
              className="input input-bordered w-full"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>
        <select
          className="select select-bordered w-full md:w-48"
          value={moverFilter}
          onChange={(e) => { setMoverFilter(e.target.value as any); setPage(1); }}
        >
          <option value="all">All Coins</option>
          <option value="gainers">Top Gainers</option>
          <option value="losers">Top Losers</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-base-200 rounded-box shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-300">
                <th className="bg-base-300"></th>
                <th className="bg-base-300">Coin</th>
                <th className="bg-base-300">Name</th>
                <th className="bg-base-300">24h Change</th>
                <th className="bg-base-300">Technical Analysis</th>
                <th className="bg-base-300">24h High</th>
                <th className="bg-base-300">24h Low</th>
                <th className="bg-base-300">Price</th>
                <th className="bg-base-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageCoins.map((coin) => (
                <tr key={coin.symbol} className="hover:bg-base-300 transition-colors duration-200">
                  <td>
                    <button 
                      onClick={() => dispatch(toggleFavorite(coin.id))}
                      className="btn btn-ghost btn-sm"
                    >
                      {favorites.includes(coin.id) ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      )}
                    </button>
                  </td>
                  <td>
                    <Link to={`/crypto/${coin.id}`} className="flex items-center gap-3 hover:opacity-80">
                      <div className="avatar">
                        <div className="mask mask-squircle h-10 w-10">
                          <img src={coin.image} alt={coin.symbol} className="h-full w-full object-cover" />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{coin.symbol.toUpperCase()}</div>
                        <div className="text-sm opacity-50">#{coin.market_cap_rank}</div>
                      </div>
                    </Link>
                  </td>
                  <td>{coin.name}</td>
                  <td>
                    <div className={`badge ${coin.price_change_24h >= 0 ? 'badge-success' : 'badge-error'} gap-1`}>
                      {coin.price_change_24h >= 0 ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12 13a1 1 0 110 2H7a1 1 0 011-1v-2.586l4.293-4.293a1 1 0 011.414 0L16 9.414V7a1 1 0 011-1h2a1 1 0 010 2h-1v3a1 1 0 01-.293.707l-5 5A1 1 0 0112 13z" clipRule="evenodd" />
                        </svg>
                      )}
                      {Math.abs(coin.price_change_24h).toFixed(2)}%
                    </div>
                  </td>
                  <td>${coin.high_24h.toLocaleString()}</td>
                  <td>
                    {coin.technicalAnalysis ? (
                      <div className="space-y-1">
                        <div className={`badge ${
                          coin.technicalAnalysis.trend.direction === 'bullish' ? 'badge-success' :
                          coin.technicalAnalysis.trend.direction === 'bearish' ? 'badge-error' :
                          'badge-warning'
                        } gap-1`}>
                          {coin.technicalAnalysis.trend.direction.toUpperCase()}
                        </div>
                        <div className="text-sm">
                          <span className="font-semibold">RSI:</span> {coin.technicalAnalysis.rsi.toFixed(2)}
                        </div>
                        <div className="text-sm">
                          <span className="font-semibold">MACD:</span> {coin.technicalAnalysis.macd.macdLine.toFixed(2)}
                        </div>
                      </div>
                    ) : (
                      <div className="badge badge-ghost">Analyzing...</div>
                    )}
                  </td>
                  <td>${coin.low_24h.toLocaleString()}</td>
                  <td>
                    <div className="font-mono">${coin.current_price.toLocaleString()}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <div className="join bg-base-200 shadow-md">
          <button
            className="join-item btn"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            « Previous
          </button>
          <button className="join-item btn btn-disabled">
            Page {page} of {totalPages}
          </button>
          <button
            className="join-item btn"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next »
          </button>
        </div>
      </div>
    </div>
  );
}
