import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export const useConversation = () => {
  const params = useParams();
  const chatId = useMemo(() => params?.id || ('' as string), [params?.id]);

  const isActive = useMemo(() => !!chatId, [chatId]);

  return {
    isActive,
    chatId,
  };
};
