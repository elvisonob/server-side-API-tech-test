import axios from 'axios';
import ApiError from '../models/http-error.js';
const getReadMe = async (repoOwner, repoName) => {
    try {
        const readmeResponse = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/README.md`);
        if (readmeResponse.data.content) {
            return Buffer.from(readmeResponse.data.content, 'base64').toString('utf-8');
        }
        throw new ApiError('README not found', 404);
    }
    catch (error) {
        if (error.response && error.response.status === 404) {
            throw new ApiError('README not found', 404);
        }
        else if (error.response && error.response.status === 403) {
            throw new ApiError('Rate limit exceeded. Try again later.', 403);
        }
        else if (error.response && error.response.status === 429) {
            // Explicit rate limit exceeded
            throw new ApiError('Rate limit exceeded. Try again later.', 429);
        }
        throw new ApiError('Error fetching README', 500);
    }
};
export default getReadMe;
