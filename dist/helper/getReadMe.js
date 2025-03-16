import axios from 'axios';
const getReadMe = async (repoOwner, repoName) => {
    try {
        const readmeResponse = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/README.md`);
        if (readmeResponse.data.content) {
            return Buffer.from(readmeResponse.data.content, 'base64').toString('utf-8');
        }
        return 'README not found';
    }
    catch (error) {
        if (error.response && error.response.status === 404) {
            return 'README not found'; // Handle missing README properly
        }
        else if (error.response && error.response.status === 403) {
            return 'Rate limit exceeded. Try again later.';
        }
        return 'Error fetching README';
    }
};
export default getReadMe;
