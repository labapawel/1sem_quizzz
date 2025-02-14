const { GoogleGenerativeAI } = require("@google/generative-ai");

async function generateStory(apiToken, prompt, systemInstruction) {
    try {
        // Input validation
        if (!apiToken) throw new Error('API token is required');
        if (!prompt) throw new Error('Prompt is required');

        // Initialize the API
        const genAI = new GoogleGenerativeAI(apiToken);
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-2.0-flash'
        });

        // Create chat session
        const chat = model.startChat({
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048,
            },
            history: [
                {
                    role: "user",
                    parts: [{ text: systemInstruction || '' }],
                },
                {
                    role: "model",
                    parts: [{ text: "Rozumiem, będę działać jako kreatywny generator" }],
                },
            ],
        });

        // Send the actual prompt
        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        return response.text();

    } catch (error) {
        console.error('Error generating story:', error.message);
        throw error;
    }
}

// Example usage
async function run() {
    try {
        const API_TOKEN = process.env.GEMINI_API_TOKEN;
        const systemInstruction = 'Jesteś kreatywnym i doświadczonym pisarzem science fiction.';
        const prompt = 'Napisz opowiadanie o podróży w kosmos.';
        
        const story = await generateStory(API_TOKEN, prompt, systemInstruction);
        console.log(story);
        
    } catch (error) {
        console.error('Failed to run story generator:', error.message);
    }
}

// Only run if this is the main module
if (require.main === module) {
    run();
}

module.exports = { generateStory };