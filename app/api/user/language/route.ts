import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isValidLanguage } from '@/config/languages';

export async function PUT(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { language } = body;

    if (!isValidLanguage(language)) {
      return new NextResponse('Invalid language', { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { language },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('[LANGUAGE_UPDATE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
