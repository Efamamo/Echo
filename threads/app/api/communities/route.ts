import { fetchCommunities } from '@/lib/actions/community.actions';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const searchString = url.searchParams.get('searchString');

  const result = await fetchCommunities({
    searchString: searchString || '',
    pageNumber: 1,
    pageSize: 20,
  });

  return NextResponse.json(result);
}
