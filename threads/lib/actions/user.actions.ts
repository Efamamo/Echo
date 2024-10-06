'use server';
import { FilterQuery, SortOrder } from 'mongoose';
import { revalidatePath } from 'next/cache';
import Community from '../models/community.model';
import Thread from '../models/thread.model';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';
import Like from '../models/like.model';

// Fetch Single User by id (from clerk) and populate it with community
export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId }).populate({
      path: 'communities', // Name of reference inside the model
      model: Community,
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

// Interface for onboarding user
interface userParams {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

// Changes user status if user exists if not creates user and makes him/her onboarded
export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: userParams): Promise<void> {
  try {
    connectToDB();

    await User.findOneAndUpdate(
      // Identifier of the user
      { id: userId },
      // Data to be updated
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onBoarded: true,
      },
      // creates user if it doesnt exists
      { upsert: true }
    );

    if (path === '/profile/edit') {
      // the next time someone accesses '/profile/edit', the page is rebuilt with the latest data from the backend (or database).
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

// Fetches all user posts
export async function fetchUserPosts(userId: string) {
  try {
    await connectToDB(); // Ensure the database connection is established.
    const user = await User.findOne({ id: userId });

    // Find threads (comments) authored by the user, where parentId is not null
    const threads = await Thread.find({
      author: user._id,
      parentId: { $in: [null, undefined] },
    })
      .populate({
        path: 'community',
        model: Community,
        select: 'name id image _id', // Select specific fields from the "Community" model
      })
      .populate({
        path: 'author', // Populate the author of the thread
        select: 'name image id', // Select specific fields from the "User" model
      })
      .populate({
        path: 'children', // Populate child threads (replies)
        model: Thread,
        populate: {
          path: 'author',
          model: User,
          select: 'name image id', // Select specific fields from the "User" model for replies
        },
      })
      .populate({
        path: 'likes', // Populate the likes associated with the thread
        model: Like,
        populate: {
          path: 'user',
          model: User, // Populate the users who liked the thread
          select: 'name id', // Select specific fields from the "User" model
        },
      });

    return threads;
  } catch (error) {
    console.error('Error fetching user comments:', error);
    throw error;
  }
}

export async function fetchUserComments(userId: string) {
  try {
    await connectToDB(); // Ensure the database connection is established.
    const user = await User.findOne({ id: userId });

    // Find threads (comments) authored by the user, where parentId is not null
    const threads = await Thread.find({
      author: user._id,
      parentId: { $ne: null, $exists: true },
    })
      .populate({
        path: 'community',
        model: Community,
        select: 'name id image _id', // Select specific fields from the "Community" model
      })
      .populate({
        path: 'author', // Populate the author of the thread
        select: 'name image id', // Select specific fields from the "User" model
      })
      .populate({
        path: 'children', // Populate child threads (replies)
        model: Thread,
        populate: {
          path: 'author',
          model: User,
          select: 'name image id', // Select specific fields from the "User" model for replies
        },
      })
      .populate({
        path: 'likes', // Populate the likes associated with the thread
        model: Like,
        populate: {
          path: 'user',
          model: User, // Populate the users who liked the thread
          select: 'name id', // Select specific fields from the "User" model
        },
      });

    return threads;
  } catch (error) {
    console.error('Error fetching user comments:', error);
    throw error;
  }
}

// Almost similar to Thead (search + pagination) and Community (search + pagination)
export async function fetchUsers({
  userId,
  searchString = '',
  pageNumber = 1,
  pageSize = 20,
  sortBy = 'desc',
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    // Calculate the number of users to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, 'i');

    // Create an initial query object to filter users.
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, // Exclude the current user from the results.
    };

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== '') {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched users based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Count the total number of users that match the search criteria (without pagination).
    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    // Check if there are more users beyond the current page.
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// Get all activities related to user post
export async function getActivity(userId: string) {
  try {
    connectToDB();

    // Find all threads created by the user
    const userThreads = await Thread.find({ author: userId });

    // Collect all the child thread ids (replies) from the 'children' field of each user thread
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    const ThreadLikes = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.likes);
    }, []);

    const ThreadReposts = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.reposts);
    }, []);

    const likes = await Like.find({
      _id: { $in: ThreadLikes },
      user: { $ne: userId },
    }).populate({
      path: 'user',
      model: User,
    });

    // Find and return the child threads (replies) excluding the ones created by the same user
    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId }, // Exclude threads authored by the same user
    }).populate({
      path: 'author',
      model: User,
      select: 'name image _id',
    });

    const reposts = await Thread.find({
      _id: { $in: ThreadReposts },
      author: { $ne: userId }, // Exclude threads authored by the same user
    }).populate({
      path: 'author',
      model: User,
      select: 'name image _id',
    });

    return { replies, likes, reposts };
  } catch (error) {
    console.error('Error fetching replies: ', error);
    throw error;
  }
}

export async function tuneIn(userId: string, recipentId: string, path: string) {
  const recipentUser = await User.findById(recipentId);
  if (!recipentUser) {
    throw new Error('User to be followed doesnt exist');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('Following user doesnt exist');
  }

  await User.findByIdAndUpdate(recipentId, {
    $push: { followers: userId },
  });
  await User.findByIdAndUpdate(userId, {
    $push: { followings: recipentId },
  });

  revalidatePath(path);
}
