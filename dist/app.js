import express from 'express';
import bodyParser from 'body-parser';
import getGithubDetails from './routes/githubRoutes.js';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
// **Trust proxy to correctly detect real client IPs**
app.set('trust proxy', 1);
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 50, // Allow 50 requests per 10 minutes per IP
    message: {
        error: 'Too many requests',
        message: 'You have exceeded the request limit. Please try again later.',
    },
    standardHeaders: true, // Sends `RateLimit-*` headers
    legacyHeaders: true, // Enable `X-RateLimit-*` headers for debugging
});
app.use('/api/github', limiter, getGithubDetails);
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: `The requested URL ${req.originalUrl} was not found on this server.`,
    });
});
app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.code || 500).json({
        error: 'Internal Server Error',
        message: error.message || 'An unknown error occurred',
    });
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
