'use client';
import { useEffect, useState } from 'react';

import CommunityCard from '@/components/cards/CommunityCard';
import SearchBar from '@/components/forms/SearchBar';

export default function Page() {
  const [result, setResult] = useState<any>({ communities: [] });
  const [searchString, setSearchString] = useState('');

  useEffect(() => {
    async function fetchCommunities() {
      try {
        const response = await fetch(
          `/api/communities?searchString=${encodeURIComponent('')}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setResult(data);
      } catch (error) {
        console.error('Failed to fetch communities:', error);
      }
    }

    fetchCommunities();
  }, []);

  // Fetch communities based on search input
  async function onsubmit() {
    try {
      const response = await fetch(
        `/api/communities?searchString=${encodeURIComponent(searchString)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Failed to fetch communities:', error);
    }
  }

  return (
    <section>
      <h1 className="head-text mb-10">Sphere</h1>
      <SearchBar
        searchString={searchString}
        setSearchString={setSearchString}
        submit={onsubmit}
        placeHolder="sphere"
      />
      <div className="mt-14 flex flex-col gap-9">
        {result.communities.length === 0 ? (
          <p className="no-result">No Sphere</p>
        ) : (
          <>
            {result.communities.map((community: any) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                username={community.username}
                imgUrl={community.image}
                bio={community.bio}
                members={community.members}
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
}
