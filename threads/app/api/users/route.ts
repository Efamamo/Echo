import { fetchUsers } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchString = url.searchParams.get('searchString');

    const user = await currentUser();

    if (!user) {
      console.log('User not authenticated');
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const userId = user.id;

    console.log(
      `Fetching users for userId: ${userId} with searchString: ${searchString}`
    );

    const result = await fetchUsers({
      userId,
      searchString: searchString || '',
      pageNumber: 1,
      pageSize: 20,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
