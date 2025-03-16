import axios from 'axios';

const getReadMe = async (repoOwner: string, repoName: string) => {
  try {
    const readmeResponse = await axios.get(
      `http://api.github.com/repos/${repoOwner}/${repoName}/contents/README.md`
    );

    if (readmeResponse.data.content) {
      return Buffer.from(readmeResponse.data.content, 'base64').toString(
        'utf-8'
      );
    }
    return null;
  } catch (error) {
    return null;
  }
};

export default getReadMe;
