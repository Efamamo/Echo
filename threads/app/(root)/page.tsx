import EchoCard from '@/components/cards/EchoCard';
import { fetchPosts } from '@/lib/actions/thread.actions';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
export default async function Home() {
  const user = await currentUser();

  if (!user) return redirect('sign-in');
  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onBoarded) redirect('/onboarding');
  const result = await fetchPosts(1, 30, userInfo._id);

  return (
    <div className="w-full h-full relative max-w-4xl">
      <h1 className="head-text">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {result.posts.map((post) => {
              return (
                <EchoCard
                  key={post._id}
                  id={post._id}
                  currentUserId={user?.id || ''}
                  parentId={post.parentId}
                  content={post.text}
                  author={post.author}
                  community={post.community}
                  createdAt={post.createdAt}
                  comments={post.children}
                  dis={true}
                  likes={post.likes}
                  reposts={post.reposts}
                />
              );
            })}
          </>
        )}
      </section>
    </div>
  );
}
