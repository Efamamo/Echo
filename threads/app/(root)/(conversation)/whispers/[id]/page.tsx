import Messages from '@/components/cards/Messages';
import ShowMessages from '@/components/cards/ShowMessages';
import SendMessage from '@/components/forms/SendMessage';
import WhisperConatiner from '@/components/shared/item-lists/whispers/WhisperContainer';
import { fetchUser, fetchWisperById } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface Messages {
  id: string;
  owner: string;
  content: string;
  time: string;
  seen: boolean;
}

export default async function Chat({ params }: { params: { id: string } }) {
  let messages;
  const user = await currentUser();
  if (!user) return;

  const userInfo = await fetchUser(user.id);
  if (!userInfo.onBoarded) redirect('/onboarding');

  const whisper = await fetchWisperById(params.id);

  let recipent = whisper.userOne;
  if (userInfo._id.equals(whisper.userOne._id)) {
    recipent = whisper.userTwo;
  }

  const userIdString = userInfo._id.toString();

  messages = whisper.messages.map((message: any) => ({
    _id: message._id.toString(),
    owner: message.owner.toString(),
    content: message.content,
    createdAt: message.createdAt,
    seen: message.seen,
  }));
  return (
    <WhisperConatiner>
      <div className="flex items-center gap-4 p-2 border-b border-gray-700">
        <Link href="/whispers">
          <Image
            src="/assets/arrow.svg"
            alt="back arrow"
            width={24}
            height={24}
          />
        </Link>
        <Image
          src={recipent.image}
          alt="back arrow"
          width={24}
          height={24}
          className="rounded-full"
        />
        <h2 className="text-heading4-medium">{recipent.name}</h2>
      </div>

      <div
        className="max-h-[600px] border-b border-gray-700 overflow-y-scroll flex pb-2  flex-col-reverse"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {whisper.messages.length === 0 && (
          <div className="w-full h-full flex justify-center items-end pb-4">
            <h3>Start Conversation</h3>
          </div>
        )}

        <ShowMessages
          messages={messages}
          userId={userIdString}
          chatId={params.id}
        />
      </div>

      <SendMessage convId={params.id} userId={userIdString} />
    </WhisperConatiner>
  );
}
