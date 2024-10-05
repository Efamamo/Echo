import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
  user: {
    type: String,
    ref: 'User',
    required: true,
  },
  thread: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thread',
    required: true,
  },
});

const Like = mongoose.models.Like || mongoose.model('Like', likeSchema);
export default Like;
