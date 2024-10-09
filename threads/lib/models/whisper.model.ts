import mongoose from 'mongoose';

const whisperSchema = new mongoose.Schema({
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      default: [],
    },
  ],
  userOne: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userTwo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastUpdate: { type: Date },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
});

const Whisper =
  mongoose.models.Whisper || mongoose.model('Whisper', whisperSchema);

export default Whisper;
