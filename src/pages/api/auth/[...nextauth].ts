import { PrismaAdapter } from '@next-auth/prisma-adapter'
import NextAuth from 'next-auth'
import EmailProvider from 'next-auth/providers/email'

import { prisma } from '@/libs/prisma'

const EMAIL_SERVER: string | undefined = process.env.EMAIL_SERVER
const EMAIL_FROM: string | undefined = process.env.EMAIL_FROM
const NEXTAUTH_SECRET: string | undefined = process.env.NEXTAUTH_SECRET

if (!EMAIL_SERVER || !EMAIL_FROM || !NEXTAUTH_SECRET) {
  throw new Error('EMAIL_SERVER, EMAIL_FROM, or NEXTAUTH_SECRET not found')
}

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: EMAIL_SERVER,
      from: EMAIL_FROM,
    }),
  ],
})
