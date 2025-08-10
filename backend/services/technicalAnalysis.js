const { RSI, MACD, SMA } = require('technicalindicators');

class TechnicalAnalysis {
    // Calculate RSI (Relative Strength Index)
    static calculateRSI(prices, period = 14) {
        const rsi = new RSI({ period, values: prices });
        const rsiValues = rsi.getResult();

        if (!rsiValues.length || rsiValues[rsiValues.length - 1] === undefined) {
            return null;
        }

        return parseFloat(rsiValues[rsiValues.length - 1].toFixed(2));
    }

    // Calculate MACD (Moving Average Convergence Divergence)
    static calculateMACD(prices) {
        const macd = new MACD({
            values: prices,
            fastPeriod: 12,
            slowPeriod: 26,
            signalPeriod: 9,
            SimpleMAOscillator: false,
            SimpleMASignal: false
        });

        const macdValues = macd.getResult();
        const lastMACD = macdValues[macdValues.length - 1];

        if (!lastMACD || lastMACD.MACD === undefined) {
            return { macdLine: null, signalLine: null, histogram: null };
        }

        return {
            macdLine: parseFloat(lastMACD.MACD.toFixed(2)),
            signalLine: parseFloat(lastMACD.signal.toFixed(2)),
            histogram: parseFloat(lastMACD.histogram.toFixed(2))
        };
    }

    // Calculate Simple Moving Averages
    static calculateSMA(prices) {
        const shortPeriod = 20;  // 20-day SMA
        const mediumPeriod = 50; // 50-day SMA
        const longPeriod = 200;  // 200-day SMA

        const shortSMA = new SMA({ period: shortPeriod, values: prices });
        const mediumSMA = new SMA({ period: mediumPeriod, values: prices });
        const longSMA = new SMA({ period: longPeriod, values: prices });

        const shortValues = shortSMA.getResult();
        const mediumValues = mediumSMA.getResult();
        const longValues = longSMA.getResult();

        return {
            short: shortValues.length ? parseFloat(shortValues[shortValues.length - 1].toFixed(2)) : null,
            medium: mediumValues.length ? parseFloat(mediumValues[mediumValues.length - 1].toFixed(2)) : null,
            long: longValues.length ? parseFloat(longValues[longValues.length - 1].toFixed(2)) : null
        };
    }

    // Analyze trend based on technical indicators
    static analyzeTrend(prices, rsi, macd) {
        let bullishSignals = 0;
        let totalSignals = 0;
        const signals = [];

        // RSI Analysis
        if (rsi !== null) {
            totalSignals++;
            if (rsi > 70) {
                signals.push('Overbought (RSI > 70)');
            } else if (rsi < 30) {
                bullishSignals++;
                signals.push('Oversold (RSI < 30)');
            } else if (rsi > 50) {
                bullishSignals += 0.5;
                signals.push('RSI showing upward momentum');
            }
        }

        // MACD Analysis
        if (macd.macdLine !== null && macd.signalLine !== null) {
            totalSignals++;
            if (macd.macdLine > macd.signalLine) {
                bullishSignals++;
                signals.push('MACD above signal line');
            } else if (macd.macdLine < macd.signalLine) {
                signals.push('MACD below signal line');
            }
        }

        // Moving Average Analysis
        const sma = this.calculateSMA(prices);
        if (sma.short !== null && sma.medium !== null && sma.long !== null) {
            totalSignals++;
            if (sma.short > sma.medium && sma.medium > sma.long) {
                bullishSignals++;
                signals.push('Bullish MA alignment');
            } else if (sma.short < sma.medium && sma.medium < sma.long) {
                signals.push('Bearish MA alignment');
            }
        }

        // Price Trend Analysis
        if (prices.length >= 5) {
            totalSignals++;
            const recentPrices = prices.slice(-5);
            const priceChange = ((recentPrices[recentPrices.length - 1] - recentPrices[0]) / recentPrices[0]) * 100;

            if (priceChange > 0) {
                bullishSignals++;
                signals.push(`Price up ${priceChange.toFixed(2)}% in last 5 days`);
            } else {
                signals.push(`Price down ${Math.abs(priceChange).toFixed(2)}% in last 5 days`);
            }
        }

        const strength = totalSignals > 0 ? (bullishSignals / totalSignals) * 100 : 0;
        const direction = strength > 60 ? 'bullish' :
                         strength < 40 ? 'bearish' :
                         'neutral';

        return {
            direction,
            strength: parseFloat(strength.toFixed(2)),
            description: signals.join('. ')
        };
    }

    // Calculate all technical indicators
    static calculateAllIndicators(prices) {
        const rsi = this.calculateRSI(prices);
        const macd = this.calculateMACD(prices);
        const sma = this.calculateSMA(prices);
        const trend = this.analyzeTrend(prices, rsi, macd);

        return {
            rsi,
            macd,
            sma,
            trend
        };
    }
}

module.exports = TechnicalAnalysis;
