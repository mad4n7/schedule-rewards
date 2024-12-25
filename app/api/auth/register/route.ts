import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signUpSchema } from '@/lib/validations/auth.schema';
import { sendVerificationEmail } from '@/lib/email';
import crypto from 'crypto';
import { z } from 'zod';
import { getTranslations } from 'next-intl/server';

export async function POST(req: Request) {
  try {
    console.log('Starting registration process');
    
    const body = await req.json();
    console.log('Request body:', body);
    
    const { locale = 'en' } = body;
    const t = await getTranslations({ locale, namespace: 'errors' });
    
    if (!body) {
      console.error('No request body provided');
      return NextResponse.json(
        { error: t('validation.noRequestBody') },
        { status: 400 }
      );
    }

    // Validate request body
    const validatedData = signUpSchema.parse(body);
    const { email, password, name } = validatedData;
    console.log('Validation passed for email:', email);

    // Check if user exists
    console.log('Checking for existing user with email:', email);
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true
        }
      });

      console.log('Prisma query completed. User found:', existingUser);

      if (existingUser) {
        console.log('User already exists:', email);
        return NextResponse.json(
          { error: t('validation.userExists') },
          { status: 409 }
        );
      }
    } catch (error) {
      console.error('Error checking for existing user:', error);
      return NextResponse.json(
        { error: t('server.userCheckError') },
        { status: 500 }
      );
    }

    console.log('Hashing password');
    const hashedPassword = await hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    console.log('Creating user in database');
    // Create user with verification token
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: null,
        verificationToken,
      },
    });
    console.log('User created:', { id: user.id, email: user.email });

    console.log('Sending verification email');
    // Send verification email
    await sendVerificationEmail({
      email,
      token: verificationToken,
      name,
      locale,
    });
    console.log('Verification email sent successfully');

    return NextResponse.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('[REGISTER_ERROR] Full error:', error);
    
    const locale = (await req.json())?.locale || 'en';
    const t = await getTranslations({ locale, namespace: 'errors' });
    
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      return NextResponse.json(
        { error: t('validation.validationError'), details: error.errors },
        { status: 400 }
      );
    }

    // Handle Prisma errors
    if (error instanceof Error && error.message.includes('Prisma')) {
      console.error('Database error:', error.message);
      return NextResponse.json(
        { error: t('server.databaseError') },
        { status: 500 }
      );
    }

    // Handle email sending errors
    if (error instanceof Error && error.message.includes('Failed to send verification email')) {
      console.error('Email sending error:', error.message);
      return NextResponse.json(
        { error: t('server.emailError') },
        { status: 500 }
      );
    }

    // Generic error response
    console.error('Unhandled error:', error);
    return NextResponse.json(
      { error: t('server.internalError') },
      { status: 500 }
    );
  }
}
