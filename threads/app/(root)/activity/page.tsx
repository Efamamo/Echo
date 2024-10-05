import React from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { fetchUser, fetchUsers, getActivity } from '@/lib/actions/user.actions';

import Image from 'next/image';

import Link from 'next/link';
export default async function Page() {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onBoarded) {
    redirect('/onboarding');
  }

  const activities = await getActivity(userInfo._id);

  return (
    <section>
      <h1 className="head-text mb-1">Activities</h1>
      <section className="mt-10 flex flex-col gap-5">
        {activities.replies.length === 0 && activities.likes.length === 0 ? (
          <p className="no-result">No Activites</p>
        ) : (
          <>
            {activities.replies.map((reply) => (
              <Link key={reply._id} href={`/thread/${reply.parentId}`}>
                <article className="activity-card">
                  <Image
                    src={reply.author.image}
                    alt="profile picture"
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                  />
                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-purple-500">
                      {reply.author.name}
                    </span>{' '}
                    replied to your thread
                  </p>
                </article>
              </Link>
            ))}
            {activities.likes.map((like) => (
              <Link key={like._id} href={`/thread/${like.thread}`}>
                <article className="activity-card">
                  <Image
                    src={like.user.image}
                    alt="profile picture"
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                  />
                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-purple-500">
                      {like.user.name}
                    </span>{' '}
                    liked to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        )}
      </section>
    </section>
  );
}
