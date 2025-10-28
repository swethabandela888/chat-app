const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  id: { type: String, required: true }, // sequence name, e.g., 'user_id'
  count: { type: Number, default: 0 }
});

const userSchema = new mongoose.Schema({
    user_name: { type :  String, required: true},
    user_id: { type: Number, require: true}
});

const chatSchema = new mongoose.Schema({
    chat_id: { type: String, required: true, default: 0 },
    participants: { type: Array },
    created_at: { type: Date, default: Date.now }
});

const messageSchema = new mongoose.Schema({
    chat_id: { type: String, ref: 'Chat', required: true },
    user_id: { type: String },
    user_name: { type: String },
    content: { type: String, required: true },
    timestamp: { type: Date, required: true, default: Date.now }
});

const Chat = mongoose.model('Chat', chatSchema);
const Message = mongoose.model('Message', messageSchema);
const Counter = mongoose.model('Counter', counterSchema);
const User = mongoose.model('User', userSchema);



module.exports = { Message , User, Counter, Chat};
