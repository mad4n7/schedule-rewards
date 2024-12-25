import { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('InvalidCredentials');
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
            select: {
              id: true,
              name: true,
              email: true,
              password: true,
              emailVerified: true,
              image: true,
            },
          });

          if (!user || !user.password) {
            throw new Error('InvalidCredentials');
          }

          const isValid = await compare(credentials.password, user.password);

          if (!isValid) {
            throw new Error('InvalidCredentials');
          }

          console.log('Email verification status:', {
            emailVerified: user.emailVerified,
            isDate: user.emailVerified instanceof Date,
            type: typeof user.emailVerified,
            value: user.emailVerified?.toString(),
          });

          if (!user.emailVerified) {
            throw new Error('Verification');
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ token, session }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/[locale]/auth/signin',
    error: '/[locale]/auth/error',
    verifyRequest: '/[locale]/auth/verify',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
