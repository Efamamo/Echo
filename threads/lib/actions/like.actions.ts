'use server';
import { revalidatePath } from 'next/cache';
import Thread from '../models/thread.model';
import Like from '../models/like.model';
import User from '../models/user.model';

export async function react(userId: string, threadId: string, path: string) {
  const thread = await Thread.findById(threadId).populate({
    path: 'likes',
    populate: { path: 'user' }, // Populates the user field in likes
  });

  if (!thread) {
    throw new Error('Thread Not Found');
  }
  const user = await User.findOne({ id: userId });

  if (!user) {
    throw new Error('User not found');
  }

  // Check if the user already liked the thread
  const existingLike = thread.likes.find(
    (like: any) => like.user.id === userId
  );

  if (existingLike) {
    // User already liked, so we remove the like
    thread.likes = thread.likes.filter((like: any) => like.user.id !== userId);
    await Like.findOneAndDelete({ user: user._id, thread: threadId }); // Ensure we delete the like specific to the user and thread
    await thread.save();

    revalidatePath(path); // Revalidate the path to reflect changes
    return;
  }

  // If the user hasn't liked yet, create a new like

  const newLike = await Like.create({
    user: user._id,
    thread: threadId,
  });

  // Push the new like to the thread's likes
  thread.likes.push(newLike);
  await thread.save();

  revalidatePath(path); // Revalidate to reflect the new like
  return;
}
