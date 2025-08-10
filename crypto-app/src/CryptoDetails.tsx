import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from './store/store';

export default function CryptoDetails() {
  const { id } = useParams<{ id: string }>();
  const { coins } = useAppSelector((state) => state.crypto);
  const coin = coins.find((c) => c.id === id);

  if (!coin) {
    return (
      <div className="min-h-[50vh] flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"/>
          <p className="text-base-content/60">Loading cryptocurrency data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <img src={coin.image} alt={coin.name} className="w-16 h-16 rounded-full"/>
        <div>
          <h1 className="text-3xl font-bold">{coin.name}</h1>
          <p className="text-xl text-base-content/70">{coin.symbol.toUpperCase()}</p>
        </div>
      </div>

      {/* Price Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat bg-base-200 rounded-box shadow-md">
          <div className="stat-title">Current Price</div>
          <div className="stat-value">${coin.current_price.toLocaleString()}</div>
        </div>
        <div className="stat bg-base-200 rounded-box shadow-md">
          <div className="stat-title">Market Cap Rank</div>
          <div className="stat-value">#{coin.market_cap_rank}</div>
        </div>
        <div className="stat bg-base-200 rounded-box shadow-md">
          <div className="stat-title">24h Change</div>
          <div className={`stat-value ${coin.price_change_24h >= 0 ? 'text-success' : 'text-error'}`}>
            {coin.price_change_24h.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Technical Analysis */}
      {coin.technicalAnalysis && (
        <div className="bg-base-200 rounded-box shadow-md p-6 space-y-4">
          <h2 className="text-2xl font-bold">Technical Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Trend</h3>
              <div className={`badge ${
                coin.technicalAnalysis.trend.direction === 'bullish' ? 'badge-success' :
                coin.technicalAnalysis.trend.direction === 'bearish' ? 'badge-error' :
                'badge-warning'
              } badge-lg`}>
                {coin.technicalAnalysis.trend.direction.toUpperCase()}
              </div>
              <p className="mt-2 text-sm">{coin.technicalAnalysis.trend.description}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">RSI</h3>
              <p className="text-xl">{coin.technicalAnalysis.rsi.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">MACD</h3>
              <div className="space-y-1 text-sm">
                <p>Signal Line: {coin.technicalAnalysis.macd.signalLine.toFixed(2)}</p>
                <p>MACD Line: {coin.technicalAnalysis.macd.macdLine.toFixed(2)}</p>
                <p>Histogram: {coin.technicalAnalysis.macd.histogram.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Market Stats */}
      <div className="bg-base-200 rounded-box shadow-md p-6 space-y-4">
        <h2 className="text-2xl font-bold">Market Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Market Cap</h3>
            <p className="text-xl">${coin.market_cap.toLocaleString()}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">24h Volume</h3>
            <p className="text-xl">${coin.total_volume.toLocaleString()}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">24h Range</h3>
            <p className="text-xl">
              ${coin.low_24h.toLocaleString()} - ${coin.high_24h.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
