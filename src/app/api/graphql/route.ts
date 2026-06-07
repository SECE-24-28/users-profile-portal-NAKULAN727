import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { typeDefs } from '@/graphql/schema/typeDefs'
import { resolvers } from '@/graphql/resolvers'
import { verifyToken, extractToken } from '@/lib/jwt'
import type { AuthContext } from '@/types'
import { NextRequest } from 'next/server'

const server = new ApolloServer<AuthContext>({ typeDefs, resolvers })

const handler = startServerAndCreateNextHandler<NextRequest, AuthContext>(server, {
  context: async (req) => {
    const token = extractToken(req.headers.get('authorization') || undefined)
    const user = token ? verifyToken(token) : null
    return { user }
  },
})

export { handler as GET, handler as POST }
