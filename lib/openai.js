import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey : process.env.OpenAI_API_KEY,
});

export default openai;