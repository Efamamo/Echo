import Image from 'next/image';
import Link from 'next/link';
import LikeEcho from '../forms/LikeEcho';
import DeleteEcho from '../forms/DeleteEcho';

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
  dis?: boolean;
  likes: {
    user: {
      id: string;
    };
  }[];
}
export default function EchoCard({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
  dis,
  likes,
}: Props) {
  const hasLiked = likes.some((like) => like.user.id === currentUserId);

  return (
    <article
      className={`relative flex w-full flex-col rounded-xl  ${
        isComment ? 'px-0 xs:px-7' : 'bg-dark-2 p-7'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link className="relative h-11 w-11" href={`/profile/${author.id}`}>
              <Image
                src={author.image}
                alt="Profile image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
            <div className="thread-card_bar" />
          </div>
          <div className="flex w-full flex-col ">
            <Link className="w-fit" href={`/profile/${author.id}`}>
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {author.name}
              </h4>
            </Link>
            <p className="mt-1 text-small-regular text-light-2">{content}</p>
            <div className="mt-5 flex flex-col gap-3">
              <div className="flex gap-3.5">
                <LikeEcho
                  hasLiked={hasLiked}
                  userId={currentUserId}
                  threadId={id}
                />
                <Link href={`/echos/${id}`}>
                  <Image
                    src="/assets/reply.svg"
                    alt="reply"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </Link>

                <Image
                  src="/assets/repost.svg"
                  alt="repost"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Image
                  src="/assets/share.svg"
                  alt="share"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
              </div>
              <p className="text-light-1 text-subtle-medium">
                {likes.length === 1 ? '1 like' : `${likes.length} likes`}
              </p>
              {dis && comments.length > 0 && (
                <Link className="flex items-center" href={`/echos/${id}`}>
                  {comments.map((comment, index) => (
                    <Image
                      key={index}
                      src={comment.author.image}
                      alt={`user_${index}`}
                      width={24}
                      height={24}
                      className={`${
                        index !== 0 && '-ml-2'
                      } rounded-full object-cover`}
                    />
                  ))}

                  <p className="mt-1 ml-2 text-subtle-medium text-gray-1">
                    {comments.length === 1
                      ? '1 reply'
                      : `${comments.length} replies`}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>

        {author.id === currentUserId && (
          <div className="flex  gap-3 absolute top-2 right-2 cursor-pointer">
            <Link href={`/echos/edit/${id}`}>
              {' '}
              <Image src="/assets/edit.svg" alt="edit" width={18} height={24} />
            </Link>
            <DeleteEcho threadId={id} />
          </div>
        )}
      </div>
    </article>
  );
}
