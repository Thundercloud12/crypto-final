// src/api/binanceSocket.ts
import type { AppDispatch } from '../store/store';
import {
  WS_CONNECT,
  WS_CONNECTED,
  WS_DISCONNECT,
  WS_UPDATE_BATCH,
} from '../store/slices/binanceSlice';

import type { BinanceTrade } from '../store/slices/binanceSlice';

export function openBinanceSocket(
  dispatch: AppDispatch,
  streams: string[] = ['btcusdt@trade']
): WebSocket {
  const base = 'wss://stream.binance.com:9443';
  const url =
    streams.length === 1
      ? `${base}/ws/${streams[0]}`
      : `${base}/stream?streams=${streams.join('/')}`;

      
  const socket = new WebSocket(url);
 
  // throttle buffer
  let buffer: Record<string, BinanceTrade> = {};
  let flushHandle: number | null = null;

  function flushNow() {
    if (Object.keys(buffer).length === 0) return;
    dispatch(WS_UPDATE_BATCH(buffer));
    buffer = {};
  }

  function scheduleFlush() {
    if (flushHandle !== null) return;
    flushHandle = window.setTimeout(() => {
      flushNow();
      flushHandle = null;
    }, 1000); 
  }

  socket.onopen = () => {
    // First mark as connecting, then as connected
    dispatch(WS_CONNECT());
    // Small delay to ensure state transitions are visible
    setTimeout(() => dispatch(WS_CONNECTED()), 100);
  };

  socket.onmessage = (evt: MessageEvent<string>) => {
    const msg = JSON.parse(evt.data);
    const data: BinanceTrade = (msg.data ?? msg) as BinanceTrade;
    // overwrite the latest for this symbol
    buffer[data.s] = data;
    scheduleFlush();
  };

  socket.onclose = () => {
    dispatch(WS_DISCONNECT());
  };

  socket.onerror = (err) => {
    console.error('Binance WS error', err);
    dispatch(WS_DISCONNECT());
  };

  return socket;
}
