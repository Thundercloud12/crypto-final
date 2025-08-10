import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../src/store/store';
import { openBinanceSocket } from '../src/api/binanceSocket';
import { WS_DISCONNECT } from '../src/store/slices/binanceSlice';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import shallowEqual from 'shallowequal';

const PAGE_SIZE = 5;
const symbols = [
  'btcusdt', 'ethusdt', 'bnbusdt', 'adausdt', 'xrpusdt',
  'solusdt', 'dogeusdt', 'maticusdt', 'ltcusdt', 'dotusdt'
];

export default function Trades() {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  // Safe selector with defaults
  const { trades, sparklines, status: wsStatus } = useAppSelector(
    (s) => {
      console.log('[Trades Debug] Full Redux State:', s);
      console.log('[Trades Debug] Binance State:', s.binance);
      
      return {
        trades: s?.binance?.trades ?? {},
        sparklines: s?.binance?.sparklines ?? {},
        status: s?.binance?.status ?? 'idle',
      };
    },
    shallowEqual
  );

  useEffect(() => {
    console.log('[Trades.tsx] Mount - opening Binance socket');
    const socket = openBinanceSocket(dispatch, symbols.map(s => `${s}@trade`));

    socket.onopen = () => console.log('[Trades.tsx] WebSocket opened');
    socket.onerror = (err) => console.error('[Trades.tsx] WebSocket error:', err);
    socket.onclose = () => console.warn('[Trades.tsx] WebSocket closed');

    return () => {
      console.log('[Trades.tsx] Unmount - closing Binance socket');
      socket.close();
      dispatch(WS_DISCONNECT());
    };
  }, [dispatch]);

  const paginatedTrades = useMemo(() => {
    const availableSymbols = Object.keys(trades);
    const sorted = symbols
      .map(sym => {
        const upperSym = sym.toUpperCase();
        if (availableSymbols.includes(upperSym)) {
          return trades[upperSym];
        }
        return null;
      })
      .filter(Boolean);

    const start = (page - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [trades, page, symbols]);

  const totalPages = Math.ceil(symbols.length / PAGE_SIZE);

  if (wsStatus === 'connecting') {
    return (
      <div className="min-h-[50vh] flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"/>
          <p className="text-base-content/60">Connecting to Binance WebSocket...</p>
        </div>
      </div>
    );
  }

  const selectedTrade = selectedSymbol ? trades[selectedSymbol] : null;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat bg-base-200 rounded-box shadow-md">
          <div className="stat-title">Active Pairs</div>
          <div className="stat-value text-secondary">{Object.keys(trades).length}</div>
          <div className="stat-desc">Live trading pairs</div>
        </div>

        {selectedTrade && (
          <>
            <div className="stat bg-base-200 rounded-box shadow-md">
              <div className="stat-title">Last Price</div>
              <div className="stat-value">
                ${parseFloat(selectedTrade?.p ?? '0').toFixed(2)}
              </div>
              <div className="stat-desc">{selectedTrade?.s}</div>
            </div>
            <div className="stat bg-base-200 rounded-box shadow-md">
              <div className="stat-title">Volume</div>
              <div className="stat-value">
                {parseFloat(selectedTrade?.q ?? '0').toFixed(4)}
              </div>
              <div className="stat-desc">Last trade volume</div>
            </div>
            <div className="stat bg-base-200 rounded-box shadow-md">
              <div className="stat-title">Trade Value</div>
              <div className="stat-value">
                ${((parseFloat(selectedTrade?.p ?? '0')) * (parseFloat(selectedTrade?.q ?? '0'))).toFixed(2)}
              </div>
              <div className="stat-desc">USDT equivalent</div>
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="bg-base-200 rounded-box shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-300">
                <th>Symbol</th>
                <th>Price (USDT)</th>
                <th>Quantity</th>
                <th>Price Trend</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTrades.map((trade) => {
                if (!trade) return null;
                const buf = sparklines[trade.s] || [];
                const isSelected = selectedSymbol === trade.s;
                return (
                  <tr
                    key={trade.s}
                    className={`hover:bg-base-300 cursor-pointer ${isSelected ? 'bg-base-300' : ''}`}
                    onClick={() => setSelectedSymbol(isSelected ? null : trade.s)}
                  >
                    <td>{trade.s}</td>
                    <td className="font-mono">${parseFloat(trade.p ?? '0').toFixed(2)}</td>
                    <td className="font-mono">{parseFloat(trade.q ?? '0').toFixed(4)}</td>
                    <td>
                      <div className="h-[40px] w-[140px]">
                        {buf.length > 0 ? (
                          <Sparklines data={buf} width={140} height={40}>
                            <SparklinesLine style={{
                              strokeWidth: 2,
                              stroke: buf[buf.length - 1] > buf[0] ? '#4ade80' : '#f87171'
                            }} />
                          </Sparklines>
                        ) : (
                          <div className="text-sm text-gray-400">Collecting data...</div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <div className="join bg-base-200 shadow-md">
          <button
            className="join-item btn"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          >
            « Previous
          </button>
          <button className="join-item btn btn-disabled">
            Page {page} of {totalPages}
          </button>
          <button
            className="join-item btn"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          >
            Next »
          </button>
        </div>
      </div>
    </div>
  );
}
