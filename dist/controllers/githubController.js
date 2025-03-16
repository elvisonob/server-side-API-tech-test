import getReadme from '../helper/getReadMe.js';
import axios from 'axios';
import ApiError from '../models/http-error.js';
const userName = async (req, res, next) => {
    try {
        const rateLimitResponse = await axios.get('https://api.github.com/rate_limit', {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, // Use your actual token or process.env for security
            },
        });
        const remainingRequests = rateLimitResponse.data.resources.core.remaining;
        const resetTime = new Date(rateLimitResponse.data.resources.core.reset * 1000);
        console.log(`Remaining requests: ${remainingRequests}`);
        console.log(`Rate limit reset at: ${resetTime}`);
        if (remainingRequests <= 0) {
            res.status(429).json({
                error: 'Rate limit exceeded',
                message: `You have exceeded the GitHub API rate limit. Please try again after ${resetTime.toISOString()}.`,
            });
            return; // Return early to stop further processing
        }
        const repoName = typeof req.query.name === 'string' ? req.query.name : undefined;
        if (!repoName) {
            throw new ApiError('Repository name is required', 400);
        }
        const githubResponse = await axios.get(`https://api.github.com/search/repositories?q=${repoName}`);
        if (!githubResponse.data.items.length) {
            throw new ApiError('No repositories found', 404);
        }
        const repositories = await Promise.all(githubResponse.data.items.map(async (repo) => {
            const readmeContent = await getReadme(repo.owner.login, repo.name);
            return {
                name: repo.name,
                forks: repo.forks_count,
                open_issues: repo.open_issues_count,
                url: repo.owner.html_url,
                readme: readmeContent || 'README not found',
            };
        }));
        res.status(200).json(repositories);
    }
    catch (error) {
        // Check if it's a Rate Limit error
        if (error.code === 429) {
            res.status(429).json({
                error: 'Rate limit exceeded',
                message: 'You have exceeded the GitHub API rate limit. Try again later.',
            });
        }
        else {
            res.status(500).json({
                error: 'Failed to fetch data from GitHub',
                details: error.message,
            });
        }
    }
};
export default userName;
