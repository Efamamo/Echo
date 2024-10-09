'use client';
import React, { useEffect, useState } from 'react';
import UserCard from '@/components/cards/UserCard';
import SearchBar from '@/components/forms/SearchBar';
import { currentUser } from '@clerk/nextjs/server';

export default function Page() {
  const [result, setResult] = useState<any>({ users: [] });
  const [searchString, setSearchString] = useState('');
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(
          `/api/users?searchString=${encodeURIComponent('')}`,
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
        console.error('Failed to fetch users:', error);
      }
    }

    fetchUsers();
  }, []);

  if (!currentUser) {
  }

  async function onsubmit() {
    try {
      const response = await fetch(
        `/api/users?searchString=${encodeURIComponent(searchString)}`,
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
      console.error('Failed to fetch users:', error);
    }
  }

  return (
    <section
      className={`w-full h-full relative max-w-4xl 
    `}
    >
      <h1 className="head-text mb-10">Quest</h1>
      <SearchBar
        searchString={searchString}
        setSearchString={setSearchString}
        submit={onsubmit}
        placeHolder="users"
      />
      <div className="mt-14 flex flex-col gap-9">
        {/* Add a check for result to avoid accessing 'users' of undefined */}
        {result && result.users.length === 0 ? (
          <p className="no-result">No Users</p>
        ) : (
          <>
            {result?.users?.map((person: any) => (
              <UserCard
                key={person.id}
                id={person.id}
                name={person.name}
                username={person.username}
                imageUrl={person.image}
                personType="User"
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
}
