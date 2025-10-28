const express = require('express');
const router = express.Router();
const { Message, User, Chat } = require('../models/message');
const getNextId = require('../lib/utils');


router.get('/user', async (req, res) => {
    try {
        let users = await User.find();
        console.log('users ::: ', users)
        res.status(200).json({ "status": true, "response": users });
    }catch(err) {
        console.log(` Failed to get users ::: ${err}` );
        res.status(500).json({"status": false, "error": "Failed to fetch users "});
    }
})

router.post('/user', async (req, res) => {
    try {
        let { user_name } = req.body;
        let user = await User.findOne({ user_name });
        if (user)
            res.status(200).json({"status": true, 'response': user });
        else {
            let next_id = await getNextId('user_id');
            let new_user = { 'user_name': user_name, 'user_id': next_id };
            console.log(' new user ::: ', new_user );
            await new User(new_user).save();
            console.info(`Saved new user :: ${new_user}`);
            res.status(201).json({"status": true, 'response':new_user });
        }
    } catch (error) {
        console.error('Failed to create new user ', error);
        res.status(500).json({ error: 'Failed to create new user ' });
    }
})

router.post('/chat', async (req, res) => {
    try {
        let participants = req.body.participants
        console.log('participants in get chat :: ', participants)
        if (typeof participants === 'string') participants = participants.split(',');
        if ( ! participants || participants.length == 0 )
            return res.status(400). json({ "status": false, "error": "Missing chat participants" });
        
        let existingChat = await Chat.findOne({ participants: { $all: participants, $size: 2 } });
        if (existingChat) {
            return res.json({ status: true, chat_id: existingChat.chat_id });
        }else{
            let new_chat_id = await getNextId('chat_id')
            let new_chat = new Chat({ "chat_id": new_chat_id, "participants": participants });
            await new_chat.save()
                .then(() => { 
                console.log (`Chat Initiated`);
                return res.status(201).json({ "status": true, "response": new_chat_id }); 
            })
            .catch((e) => { 
                console.error(`Chat Initiation failed :: ${e}`);
                return res.status(400).json({ "status": false, "error": "Chat initiation failed" }); 
            })
        }

    }catch(err) {
        console.error(`Failed to get chat id ::: ${err}`)
        res.status(500).json({ "status": false, "error": "Failed to get new chat id"})
    }
})


router.get('/messages', async (req, res) => {
    try {
        let chat_id = req.query.chat_id
        console.log('fetch messages :: ', chat_id);

        if (!chat_id) 
            return res.status(400).json({ error: 'chat_id query param is required' });

        const messages = await Message.find({ chat_id: chat_id }).sort({ timestamp: -1 }).limit(10);
        /*const messages = await Message.find({chat_id: chat_id, timestamp: {$lt: lasttimestamp}})
                                        .sort({timestamp: -1})
                                        .limit(10)
        
        */
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Error fetching messages' });
    }
});

// Expects JSON body: { "content": "...", "user_name": "...", "user_id": "..." }
router.post('/messages', async (req, res) => {
    try {
        console.log('POST body:', req.body);
        const { chat_id, content, user_name, user_id } = req.body || {};
        if (!content) {
            return res.status(400).json({ error: 'Message content is required' });
        }
        if ( !chat_id ){
            return res.status(400).json({ error: 'Chat Id is required' });
        }
        console.log('received msg  ::: ', content, user_id, user_name)
        const message = new Message({ chat_id, content, user_name, user_id });
        await message.save();
        res.status(201).json({ "status": true, "response": message });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({"status": false,  error: 'Error saving message' });
    }
});

module.exports = router;
