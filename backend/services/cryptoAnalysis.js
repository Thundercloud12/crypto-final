const TechnicalAnalysis = require('./technicalAnalysis');

async function analyzeCryptoData(prices) {
    try {
        return TechnicalAnalysis.calculateAllIndicators(prices);
    } catch (error) {
        console.error('Error analyzing crypto data:', error);
        throw error;
    }
}

// Endpoint to analyze price data
async function analyzePriceData(priceData) {
    try {
        const prices = Array.isArray(priceData) ? priceData : [];
        if (prices.length < 14) { // Minimum data points needed for analysis
            throw new Error('Insufficient price data for analysis');
        }
        
        return await analyzeCryptoData(prices);
    } catch (error) {
        console.error('Error in price analysis:', error);
        throw error;
    }
}

module.exports = {
    analyzePriceData
};
