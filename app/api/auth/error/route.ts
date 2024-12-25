import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get('error');

  return NextResponse.json(
    { 
      error: error || 'Unknown error',
      message: getErrorMessage(error)
    },
    { status: 200 }
  );
}

function getErrorMessage(error: string | null): string {
  switch (error) {
    case 'Verification':
      return 'Please verify your email before signing in.';
    case 'AccessDenied':
      return 'Invalid email or password. Please try again.';
    default:
      return 'An error occurred during authentication. Please try again.';
  }
}
