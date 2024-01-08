import axios from 'axios';

export const summarizeText = async (req, res) => {
  try {
    const { language, text, min_length, max_length } = req.body;
    const API_KEY = 'mqUodwawpAFxPhiioYQIRWXSFmAFnvLPGItfgTZLwDHdRiafLj'; // Replace with your API key

    const response = await axios.post('https://portal.ayfie.com/api/summarize', {
      language,
      text,
      min_length,
      max_length
    }, {
      headers: {
        'X-API-KEY': API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
