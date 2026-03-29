// utils/googleSearch.js
import axios from 'axios';

const API_KEY = 'SIZNING_GOOGLE_API_KEY';
const CX = 'SIZNING_SEARCH_ENGINE_ID';

export const searchImages = async (query) => {
    try {
        const response = await axios.get(
            `https://www.googleapis.com/customsearch/v1`, {
                params: {
                    key: API_KEY,
                    cx: CX,
                    q: query,
                    searchType: 'image',
                    num: 8,
                }
            }
        );
        return response.data.items.map(item => item.link);
    } catch (error) {
        console.error("Google Search Error:", error);
        return [];
    }
};