const yahooFinance = require('yahoo-finance2');
const TechnicalAnalysis = require('./technicalAnalysis');

const DEFAULT_STOCKS = [
    'AAPL',  // Apple
    'GOOGL', // Alphabet
    'MSFT',  // Microsoft
    'AMZN',  // Amazon
    'META',  // Meta (Facebook)
    'TSLA',  // Tesla
    'NVDA',  // NVIDIA
    'JPM',   // JPMorgan Chase
    'V',     // Visa
    'WMT'    // Walmart
];

async function getStockQuote(symbol) {
    try {
        const quote = await yahooFinance.quote(symbol);
        return {
            symbol: quote.symbol,
            name: quote.longName || quote.shortName || quote.symbol,
            price: quote.regularMarketPrice,
            change: quote.regularMarketChange,
            changePercent: quote.regularMarketChangePercent,
            timestamp: Date.now()
        };
    } catch (error) {
        console.error(`Error fetching quote for ${symbol}:`, error);
        throw error;
    }
}

async function getHistoricalData(symbol, days = 200) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    try {
        const result = await yahooFinance.historical(symbol, {
            period1: startDate,
            period2: endDate
        });

        return result.map(bar => bar.close);
    } catch (error) {
        console.error(`Error fetching historical data for ${symbol}:`, error);
        throw error;
    }
}

async function getStockAnalysis(symbol) {
    try {
        const [stockData, historicalPrices] = await Promise.all([
            getStockQuote(symbol),
            getHistoricalData(symbol)
        ]);

        const technicalIndicators = TechnicalAnalysis.calculateAllIndicators(historicalPrices);

        return {
            ...stockData,
            technicalIndicators,
            historicalPrices: historicalPrices.slice(-30) // Last 30 days for chart
        };
    } catch (error) {
        console.error(`Error analyzing stock ${symbol}:`, error);
        throw error;
    }
}

async function getAllStocksAnalysis() {
    try {
        const analysisPromises = DEFAULT_STOCKS.map(symbol => 
            getStockAnalysis(symbol)
                .catch(error => {
                    console.error(`Error analyzing ${symbol}:`, error);
                    return null;
                })
        );

        const results = await Promise.all(analysisPromises);
        return results.filter(result => result !== null);
    } catch (error) {
        console.error('Error fetching all stocks analysis:', error);
        throw error;
    }
}

module.exports = {
    getStockQuote,
    getHistoricalData,
    getStockAnalysis,
    getAllStocksAnalysis
};
