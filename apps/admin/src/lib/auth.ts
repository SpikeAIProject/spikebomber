import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/v1';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'admin-credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        try {
          const res = await axios.post<{
            user: { id: string; email: string; name: string; role: string };
            tokens: { accessToken: string; refreshToken: string };
          }>(`${API_URL}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });
          const { user, tokens } = res.data;
          if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') return null;
          return { ...user, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
        } catch {
          return null;
        }
      },
    }),
  ],
  pages: { signIn: '/login', error: '/login' },
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        token.accessToken = (user as { accessToken?: string }).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        role: token.role as string,
      } as typeof session.user & { id: string; role: string };
      (session as Record<string, unknown>).accessToken = token.accessToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
