import getReadme from '../helper/getReadMe.js';
import axios from 'axios';
const userName = async (req, res, next) => {
    try {
        const repoName = typeof req.query.name === 'string' ? req.query.name : undefined;
        if (!repoName) {
            res.status(400).json({ error: 'Repository name is required' });
            return;
        }
        const githubResponse = await axios.get(`https://api.github.com/search/repositories?q=${repoName}`);
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
        res.status(500).json({
            error: 'Failed to fetch data from GitHub',
            details: error.message,
        });
    }
};
export default userName;
