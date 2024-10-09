import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now() },
  content: { type: String, required: true },
  seen: { type: Boolean, default: false },
});

const Message =
  mongoose.models.Message || mongoose.model('Message', messageSchema);

export default Message;
