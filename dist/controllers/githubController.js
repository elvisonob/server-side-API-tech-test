import getReadme from '../helper/getReadMe.js';
import axios from 'axios';
import pLimit from 'p-limit';
const limit = pLimit(20);
import ApiError from '../models/http-error.js';
const checkRateLimit = async () => {
    try {
        const response = await axios.get('https://api.github.com/rate_limit');
        const remaining = parseInt(response.headers['x-ratelimit-remaining'], 10); // Ensure it's a valid number
        const resetTime = parseInt(response.headers['x-ratelimit-reset'], 10); // Ensure reset time is valid
        console.log('Remaining', remaining);
        if (remaining === 0) {
            if (isNaN(resetTime)) {
                throw new ApiError('Rate limit exceeded, but reset time is not available.', 429);
            }
            throw new ApiError(`Rate limit exceeded. Try again at ${new Date(resetTime * 1000).toLocaleTimeString()}`, 429);
        }
    }
    catch (error) {
        // Catch any issues while getting rate limit info
        console.error(error); // Log the error for debugging
        throw new ApiError('Error checking rate limits', 500);
    }
};
const userName = async (req, res, next) => {
    try {
        const repoName = typeof req.query.name === 'string' ? req.query.name : undefined;
        if (!repoName) {
            throw new ApiError('Repository name is require', 400);
        }
        await checkRateLimit();
        const githubResponse = await axios.get(`https://api.github.com/search/repositories?q=${repoName}`);
        if (!githubResponse.data.items.length) {
            throw new ApiError('No repositories found', 404);
        }
        const repositories = await Promise.all(githubResponse.data.items.map((repo) => limit(async () => {
            const readmeContent = await getReadme(repo.owner.login, repo.name);
            return {
                name: repo.name,
                forks: repo.forks_count,
                open_issues: repo.open_issues_count,
                url: repo.owner.html_url,
                readme: readmeContent || 'README not found',
            };
        })));
        res.status(200).json(repositories);
    }
    catch (error) {
        res.status(500).json({
            error: 'Failed to fetch data from GitHub',
            details: error.message,
        });
    }
};
export default userName;
