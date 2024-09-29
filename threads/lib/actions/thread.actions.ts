'use server';
import { revalidatePath } from 'next/cache';
import Thread from '../models/thread.model';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';
import { model } from 'mongoose';

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
    connectToDB();

    const createdThread = await Thread.create({
      text,
      author,
      community: null,
    });

    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });
    revalidatePath(path);
  } catch (error: any) {
    console.log(error);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  // Ensure the DB connection is established
  await connectToDB();

  const skipAmount = (pageNumber - 1) * pageSize;

  // Fetch top-level threads (posts) with their authors and children populated
  const posts = await Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: 'author',
      model: User,
    })
    .populate({
      path: 'children', // Populate child posts
      populate: {
        path: 'author',
        model: User, // Populate author information for child posts
        select: '_id name parentId image',
      },
    })
    .exec(); // Execute the query

  // Get the total count of top-level posts
  const totalPostsCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  // Check if there are more pages (next page available)
  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

export async function fetchThreadById(id: string) {
  try {
    connectToDB();
    const thread = await Thread.findById(id)
      .populate({
        path: 'author',
        model: User,
        select: '_id id name image',
      })
      .populate({
        path: 'children',
        populate: [
          {
            path: 'author',
            model: User,
          },
          {
            path: 'children',
            model: Thread,
            populate: {
              path: 'author',
              model: User,
            },
          },
        ],
      });
  } catch (error) {
    throw new Error(`Failed to fetch thread: ${error}`);
  }
}
