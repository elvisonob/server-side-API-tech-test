import axios from 'axios';
import ApiError from '../models/http-error.js';

const getReadMe = async (repoOwner: string, repoName: string) => {
  try {
    const readmeResponse = await axios.get(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/README.md`
    );

    if (readmeResponse.data.content) {
      return Buffer.from(readmeResponse.data.content, 'base64').toString(
        'utf-8'
      );
    }
    throw new ApiError('README not found', 404);
  } catch (error: any) {
    const statusCode = error.response?.status;
    const errorMessage = error.message || 'Error fetching README';

    if (statusCode === 404) {
      throw new ApiError('README not found', 404);
    }

    if (statusCode === 403) {
      throw new ApiError('Rate limit exceeded. Try again later.', 403);
    }

    throw new ApiError(errorMessage, statusCode || 500);
  }
};

export default getReadMe;
