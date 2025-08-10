const express = require('express');
const cors = require('cors');
const { analyzePriceData } = require('./services/cryptoAnalysis');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Endpoint to analyze crypto price data
app.post('/api/analyze', async (req, res) => {
    try {
        const { prices } = req.body;
        if (!prices || !Array.isArray(prices)) {
            return res.status(400).json({ error: 'Invalid price data' });
        }

        const analysis = await analyzePriceData(prices);
        res.json(analysis);
    } catch (error) {
        console.error('Error analyzing data:', error);
        res.status(500).json({ error: 'Failed to analyze price data' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
