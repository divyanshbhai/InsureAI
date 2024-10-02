const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const getAI = require('./ai.js');
const User = require('./models/User'); // Import User model
const Chat = require('./models/Chat'); // Import Chat model

let userData = [['mob', 'chatid']];
const client = new Client({
    authStrategy: new LocalAuth(),
});

// Generate and display QR code for login
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

// When the client is ready, it will be authenticated
client.on('ready', () => {
    console.log('WhatsApp client is ready!');
});

// Listen for incoming messages
client.on('message', async (message) => {
    const mobileNo = message.from; // User's mobile number (WhatsApp ID)

    try {
        // Check if the user exists in the database
        let user = await User.findOne({ mobileNo });
        
        if (!user) {
            // Create a new user if not found
            user = new User({ mobileNo, chatId: message.id._serialized }); // Create new user
            await user.save(); // Save user to DB
            console.log("New user created:", user);
        } else {
            // Update the chatId if the user already exists
            user.chatId = message.id._serialized;
            await user.save();
            console.log("User updated:", user);
        }

        // Get response from the AI assistant
        let response;
        for (let u of userData) {
            if (u[0] === mobileNo) {
                response = await getAI(message.body, u[1], mobileNo);
                console.log("Old user data:", userData);
                break; // Exit the loop if the user is found
            }
        }

        if (!response) {
            response = await getAI(message.body, "", mobileNo);
            userData.push([mobileNo, response.conversationId]); // Add new user data
            console.log("New user data:", userData);
        }

        // Save chat to DB
        const chat = new Chat({
            userId: user._id,
            message: message.body,
            response: response.answer || "Sorry, I couldn't process that request.",
        });
        await chat.save(); // Save chat to DB

        message.reply(chat.response); // Reply with the AI's answer
    } catch (error) {
        console.error('Error fetching AI response:', error);
        message.reply("Sorry, I couldn't process that request.");
    }
});

// Start the client
client.initialize();
