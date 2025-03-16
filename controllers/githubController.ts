import { Request, Response, NextFunction } from 'express';
import getReadme from '../helper/getReadMe.js';
import axios from 'axios';
import ApiError from '../models/http-error.js';
import { GitHubRepositorySearchResult } from '../types/github.js';

const searchRepositories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const repoName =
      typeof req.query.name === 'string' && req.query.name.trim() !== ''
        ? req.query.name
        : undefined;

    if (!repoName) {
      throw new ApiError('Repository name is required', 400);
    }

    const githubResponse = await axios.get<GitHubRepositorySearchResult>(
      `https://api.github.com/search/repositories?q=${repoName}`
    );

    if (!githubResponse.data.items.length) {
      throw new ApiError('No repositories found', 404);
    }

    const repositories = await Promise.all(
      githubResponse.data.items.map(async (repo) => {
        try {
          const readmeContent = await getReadme(repo.owner.login, repo.name);
          return {
            name: repo.name,
            forks: repo.forks_count,
            open_issues: repo.open_issues_count,
            url: repo.owner.html_url,
            readme: readmeContent || 'README not found',
          };
        } catch (error) {
          return {
            name: repo.name,
            forks: repo.forks_count,
            open_issues: repo.open_issues_count,
            url: repo.owner.html_url,
            readme: 'Failed to fetch README',
          };
        }
      })
    );

    res.status(200).json(repositories);
  } catch (error: any) {
    next(
      new ApiError(
        error.message || 'Failed to fetch data from GitHub',
        error.response?.status || 500
      )
    );
  }
};

export default searchRepositories;
