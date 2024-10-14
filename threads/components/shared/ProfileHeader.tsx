import Image from 'next/image';
import TuneIn from '../forms/FollowUser';
import Link from 'next/link';
import TuneBack from '../forms/FollowBack';
import { fetchWisper } from '@/lib/actions/user.actions';

interface Props {
  accountUser: any;
  currentUser: any;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  type?: 'User' | 'Community';
}
export default async function ProfileHeader({
  accountUser,
  currentUser,
  name,
  username,
  imgUrl,
  bio,
}: Props) {
  const userFollows = currentUser.followings.find((userId: any) =>
    userId.equals(accountUser._id)
  );
  const userFollowed = accountUser.followings.find((userId: any) =>
    userId.equals(currentUser._id)
  );
  let chatLink: any;

  if (userFollowed && userFollows) {
    chatLink = await fetchWisper(currentUser, accountUser);
  }

  return (
    <div className="flex flex-col justify-start w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={imgUrl}
              alt="Profile Image"
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>

          <div className="flex-1 ">
            <h2 className="text-left text-heading3-bold text-light-1">
              {name}
            </h2>
            <p className="text-base-medium text-gray-1">@{username}</p>
          </div>
        </div>

        {!accountUser._id.equals(currentUser._id) && (
          <div className="text-light-1">
            {userFollows && userFollowed ? (
              <Link href={`/whispers/${chatLink?._id}`}>
                <Image
                  src="/assets/chat.svg"
                  alt=",essage"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                  title="message"
                />
              </Link>
            ) : userFollows && !userFollowed ? (
              <Image
                src="/assets/loading.svg"
                alt="loading"
                width={30}
                height={30}
                className="cursor-pointer object-contain"
                title="loading"
              />
            ) : !userFollows && userFollowed ? (
              <TuneBack userId={currentUser._id} recipentId={accountUser._id} />
            ) : (
              <TuneIn userId={currentUser._id} recipentId={accountUser._id} />
            )}
          </div>
        )}
      </div>

      <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>
      <div className="mt-12 h-0.5 w-full bg-dark-3" />
    </div>
  );
}
