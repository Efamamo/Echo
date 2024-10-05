import { fetchUsers } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const searchString = url.searchParams.get('searchString');

  const user = await currentUser();

  if (!user) return;

  const userId = user.id;

  const result = await fetchUsers({
    userId,
    searchString: searchString || '',
    pageNumber: 1,
    pageSize: 20,
  });

  return NextResponse.json(result);
}
