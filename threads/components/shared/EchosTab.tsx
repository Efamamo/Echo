import { fetchUserComments, fetchUserPosts } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import ThreadCard from '../cards/EchoCard';
import { fetchCommunityPosts } from '@/lib/actions/community.actions';

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
  fetch: string;
}
export default async function EchosTab({
  currentUserId,
  accountId,
  accountType,
  fetch,
}: Props) {
  let result: any;

  if (accountType === 'Community') {
    result = await fetchCommunityPosts(accountId);
  } else {
    if (fetch === 'echos') {
      result = await fetchUserPosts(accountId);
    } else {
      result = await fetchUserComments(accountId);
    }

    if (!result) redirect('/');
  }

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.length === 0 && <p className="no-result">No Result</p>}
      {result.map((thread: any) => {
        let reply = '';
        if (fetch === 'replies') {
          reply = thread.parentId;
        }
        return (
          <ThreadCard
            key={thread._id}
            id={thread._id}
            reply={reply}
            currentUserId={currentUserId}
            parentId={thread.parentId}
            content={thread.text}
            author={
              accountType === 'User'
                ? {
                    name: thread.author.name,
                    image: thread.author.image,
                    id: thread.author.id,
                  }
                : {
                    name: thread.author.name,
                    image: thread.author.image,
                    id: thread.author.id,
                  }
            }
            community={thread.community}
            createdAt={thread.createdAt}
            comments={thread.children}
            isComment={true}
            dis={true}
            likes={thread.likes}
            reposts={thread.reposts}
          />
        );
      })}
    </section>
  );
}
