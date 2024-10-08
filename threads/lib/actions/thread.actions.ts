'use server';

import { revalidatePath } from 'next/cache';

import { connectToDB } from '../mongoose';

import User from '../models/user.model';
import Thread from '../models/thread.model';
import Community from '../models/community.model';
import Like from '../models/like.model';

export async function fetchPosts(
  pageNumber = 1,
  pageSize = 20,
  userId: string
) {
  await connectToDB(); // Ensure DB connection

  const skipAmount = (pageNumber - 1) * pageSize;

  // Fetch all posts where the parent is null (top-level posts)
  const postsQuery = Thread.find({
    parentId: { $in: [null, undefined] },
  })
    .sort({ createdAt: 'desc', _id: 'desc' })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: 'author',
      populate: {
        path: 'followings', // Fetch the followings of the author
        select: '_id', // Only need the _id field to check the following relationship
      },
    })
    .populate('community')
    .populate({
      path: 'children',
      populate: {
        path: 'author',
        select: '_id name image',
      },
    })
    .populate({
      path: 'likes',
      populate: { path: 'user' },
    });

  const posts = await postsQuery.exec();

  // Filter posts where the author is either:
  // 1. Following the current user (author follows current user)
  // 2. The author is the current user themselves
  const filteredPosts = posts.filter(
    (post) =>
      post.author._id.equals(userId) || // Author is the current user
      post.author.followings.some((following: any) =>
        following._id.equals(userId)
      )
  );

  // Count the total number of filtered posts for pagination purposes
  const totalPostsCount = filteredPosts.length;
  const isNext = totalPostsCount > skipAmount + filteredPosts.length;

  return { posts: filteredPosts, isNext };
}

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createThread({
  text,
  author,
  communityId,
  path,
}: Params) {
  try {
    await connectToDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdThread = await Thread.create({
      text,
      author,
      community: communityIdObject, // Assign communityId if provided, or leave it null for personal account
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { threads: createdThread._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}

interface UParams {
  text: string;
  id: string;
  author: string;
  path: string;
}

export async function updateThread({ text, id, author, path }: UParams) {
  try {
    await connectToDB();

    const thread = await Thread.findById(id);

    if (thread.author.toHexString() !== author) {
      throw new Error(
        `Failed to update thread: thread doesnt belong to the user`
      );
    }

    if (!thread) {
      throw new Error(`Thread not found`);
    }

    thread.text = text;
    await thread.save();

    revalidatePath(path);
  } catch (error: any) {
    console.log(error);
    throw new Error(`Failed to update thread: ${error.message}`);
  }
}

async function fetchAllChildThreads(threadId: string): Promise<any[]> {
  const childThreads = await Thread.find({ parentId: threadId });

  const descendantThreads = [];
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread._id);
    descendantThreads.push(childThread, ...descendants);
  }

  return descendantThreads;
}

export async function deleteThread(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // Find the thread to be deleted (the main thread)
    const mainThread = await Thread.findById(id).populate('author community');

    if (!mainThread) {
      throw new Error('Thread not found');
    }

    if (mainThread.originalThread) {
      const original = await Thread.findById(mainThread.originalThread);

      if (original) {
        original.reposts = original.reposts.filter(
          (repost: any) => !repost.equals(mainThread._id) // Use equals to compare ObjectIds
        );
        console.log(original.reposts);
        await original.save();
      }
    }

    // Fetch all child threads and thei      console.log(original.reposts);
    const descendantThreads = await fetchAllChildThreads(id);

    // Get all descendant thread IDs including the main thread ID and child thread IDs
    const descendantThreadIds = [
      id,
      ...descendantThreads.map((thread) => thread._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child threads and their descendants
    await Thread.deleteMany({ _id: { $in: descendantThreadIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}

export async function fetchThreadById(threadId: string) {
  connectToDB();

  try {
    const thread = await Thread.findById(threadId)
      .populate({
        path: 'author',
        model: User,
        select: '_id id name image',
      }) // Populate the author field with _id and username
      .populate({
        path: 'community',
        model: Community,
        select: '_id id name image',
      }) // Populate the community field with _id and name
      .populate({
        path: 'children', // Populate the children field
        populate: [
          {
            path: 'author', // Populate the author field within children
            model: User,
            select: '_id id name parentId image', // Select only _id and username fields of the author
          },
          {
            path: 'children', // Populate the children field within children
            model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
            populate: {
              path: 'author', // Populate the author field within nested children
              model: User,
              select: '_id id name parentId image', // Select only _id and username fields of the author
            },
          },
          {
            path: 'likes',
            model: Like,
            populate: {
              path: 'user',
              model: User,
            },
          },
        ],
      })
      .populate({
        path: 'likes',
        model: Like,
        populate: {
          path: 'user',
          model: User,
        },
      })
      .exec();

    return thread;
  } catch (err) {
    console.error('Error while fetching thread:', err);
    throw new Error('Unable to fetch thread');
  }
}

export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    // Find the original thread by its ID
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error('Thread not found');
    }

    // Create the new comment thread
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId, // Set the parentId to the original thread's ID
    });

    // Save the comment thread to the database
    const savedCommentThread = await commentThread.save();

    // Add the comment thread's ID to the original thread's children array
    originalThread.children.push(savedCommentThread._id);

    // Save the updated original thread to the database
    await originalThread.save();

    revalidatePath(path);
  } catch (err) {
    console.error('Error while adding comment:', err);
    throw new Error('Unable to add comment');
  }
}

interface repostParams {
  text: string;
  author: string;
  originalThread: string;
  communityId: string | null;
  path: string;
}

export async function repostThread({
  text,
  author,
  communityId,
  path,
  originalThread,
}: repostParams) {
  try {
    await connectToDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const user = await User.findOne({ id: author });

    const ot = await Thread.findById(originalThread);
    if (ot.parentId) {
      return;
    }

    const createdThread = await Thread.create({
      text,
      author: user._id,
      community: communityIdObject,
      originalThread: originalThread,
    });

    // Update User model
    await User.findByIdAndUpdate(user._id, {
      $push: { threads: createdThread._id },
    });

    await Thread.findByIdAndUpdate(originalThread, {
      $push: { reposts: createdThread._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { threads: createdThread._id },
      });
    }
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}
