const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const getAI = require('./ai.js');
const User = require('./models/User');
const Chat = require('./models/Chat');

let userData = [['mob', 'chatid']];
const client = new Client({
    authStrategy: new LocalAuth(),
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp client is ready!');
});


client.on('message', async (message) => {
    const mobileNo = message.from; 

    try {
        let user = await User.findOne({ mobileNo });
        
        if (!user) {
            user = new User({ mobileNo, chatId: message.id._serialized }); 
            await user.save(); 
            console.log("New user created:", user);
        } else {
            user.chatId = message.id._serialized;
            await user.save();
            console.log("User updated:", user);
        }

        let response;
        for (let u of userData) {
            if (u[0] === mobileNo) {
                response = await getAI(message.body, u[1], mobileNo);
                console.log("Old user data:", userData);
                break; 
            }
        }

        if (!response) {
            response = await getAI(message.body, "", mobileNo);
            userData.push([mobileNo, response.conversationId]);
            console.log("New user data:", userData);
        }


        const chat = new Chat({
            userId: user._id,
            message: message.body,
            response: response.answer || "Sorry, I couldn't process that request.",
        });
        await chat.save();

        message.reply(chat.response);
    } catch (error) {
        console.error('Error fetching AI response:', error);
        message.reply("Sorry, I couldn't process that request.");
    }
});

client.initialize();
