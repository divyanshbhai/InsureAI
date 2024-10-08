const axios = require('axios');

async function getAI(question, chatId = "", sender = "test") {
    const url = "https://api.dify.ai/v1/chat-messages";
    const apiKey = "app-uaUklKkoP9SUoZTkoxsa2SRf";

    const payload = {
        inputs: {},
        query: question,
        response_mode: "blocking",
        user: sender,
        conversation_id: chatId
    };

    const headers = {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.post(url, payload, { headers });
        const responseData = response.data;
        const answer = responseData.answer;
        const conversationId = responseData.conversation_id;

        return { answer, conversationId };
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}

// Export the getAI function
module.exports = getAI;
