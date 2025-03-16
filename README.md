# 🚀 GitHub Repository Query Service

This is a **Node.js service** that interacts with the **GitHub API** to allow users to:

- Search for repositories by name.
- Fetch repository details (forks, open issues, owner URL, and README content).
- Handle API requests efficiently with best practices.
- Built using **Express.js** and **Axios** for API handling.

The server is set on port 8080 and the query link for postman is below:

GET http://localhost:8080/api/github/repositories?name=elvisonob

<h1>Setup</h1>
Please Fork this repository
<br>
Clone the forked repository onto your local machine
<br>
In the root directory, type `npm install`, which installs dependencies for the project
<br>
Finally, type `npm start` to get the Server started.
<br>

## 🚀 Potential Enhancements

While the API is fully functional, future iterations could include:

- **Rate Limiting Optimization**: Implementing advanced request limiting to prevent excessive API calls.
- **Caching Mechanism**: Using Redis or in-memory caching to reduce redundant GitHub API requests.
