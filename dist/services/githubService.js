import axios from 'axios';
import getReadMe from '../helper/getReadMe.js';
import ApiError from '../models/http-error.js';
const searchRepositories = async (repoName) => {
    try {
        // Make a request to GitHub to search for repositories
        const githubResponse = await axios.get(`https://api.github.com/search/repositories?q=${repoName}`);
        // If no repositories are found, throw a custom 404 error
        if (githubResponse.data.items.length === 0) {
            throw new ApiError('Repository not found', 404);
        }
        // Process repositories and fetch README for each
        const repositories = await Promise.all(githubResponse.data.items.map(async (repo) => {
            const readmeContent = await getReadMe(repo.owner.login, repo.name);
            return {
                name: repo.name,
                forks: repo.forks_count,
                open_issues: repo.open_issues_count,
                url: repo.owner.html_url,
                readme: readmeContent || 'README not found',
            };
        }));
        return repositories;
    }
    catch (error) {
        // If an error occurs, rethrow it with the appropriate status code
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Failed to fetch data from GitHub', 500); // Default error handling
    }
};
export { searchRepositories };
