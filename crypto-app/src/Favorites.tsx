import React from 'react';
import { useAppSelector, useAppDispatch } from './store/store';
import { toggleFavorite } from './store/slices/CryptoSlice';
import { Link } from 'react-router-dom';

export default function Favorites() {
  const dispatch = useAppDispatch();
  const { coins, favorites } = useAppSelector((state) => state.crypto);
  const favoriteCoins = coins.filter(coin => favorites.includes(coin.id));

  if (favoriteCoins.length === 0) {
    return (
      <div className="min-h-[50vh] flex justify-center items-center">
        <div className="text-center space-y-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <h2 className="text-2xl font-bold">No Favorites Yet</h2>
          <p className="text-base-content/60">Add cryptocurrencies to your favorites to track them here.</p>
          <Link to="/" className="btn btn-primary">Browse Cryptocurrencies</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto bg-base-200 rounded-box shadow-md">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-300">
              <th className="bg-base-300"></th>
              <th className="bg-base-300">Coin</th>
              <th className="bg-base-300">Price</th>
              <th className="bg-base-300">24h Change</th>
              <th className="bg-base-300">Market Cap</th>
              <th className="bg-base-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {favoriteCoins.map((coin) => (
              <tr key={coin.id} className="hover:bg-base-300 transition-colors duration-200">
                <td>
                  <button 
                    onClick={() => dispatch(toggleFavorite(coin.id))}
                    className="btn btn-ghost btn-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
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
                <td>
                  <div className="font-mono">${coin.current_price.toLocaleString()}</div>
                </td>
                <td>
                  <div className={`badge ${coin.price_change_24h >= 0 ? 'badge-success' : 'badge-error'} gap-1`}>
                    {coin.price_change_24h >= 0 ? '+' : ''}{coin.price_change_24h.toFixed(2)}%
                  </div>
                </td>
                <td>${(coin.market_cap / 1e9).toFixed(2)}B</td>
                <td>
                  <Link to={`/crypto/${coin.id}`} className="btn btn-ghost btn-sm">
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
