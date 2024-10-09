import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';
import { MessageSquare, Users } from 'lucide-react';

export default function useNavigation() {
  const pathName = usePathname();
  const paths = useMemo(
    () => [
      {
        name: 'Chats',
        href: '/whispers',
        icon: (
          <MessageSquare
            className={`${
              pathName.startsWith('/whispers') ? 'bg-blue' : 'bg-dark-2'
            }  p-0 m-0`}
          />
        ),
        active: pathName.startsWith('/whispers'),
      },
      {
        name: 'Friends',
        href: '/friends',
        icon: <Users className="bg-dark-2" />,
        active: pathName.startsWith('/friends'),
      },
    ],
    [pathName]
  );
  return paths;
}
