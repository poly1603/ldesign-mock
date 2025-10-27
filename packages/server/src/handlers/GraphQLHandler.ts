/**
 * GraphQL 处理器
 */

import type { Express } from 'express'
import { createYoga } from 'graphql-yoga'
import { makeExecutableSchema } from '@graphql-tools/schema'
import type { DataGenerator } from '@ldesign/mock-core'

interface GraphQLHandlerOptions {
  dataGenerator: DataGenerator
  endpoint?: string
  playground?: boolean
}

/**
 * GraphQL 处理器类
 */
export class GraphQLHandler {
  private dataGenerator: DataGenerator
  private endpoint: string
  private playground: boolean
  private yoga: any

  constructor(options: GraphQLHandlerOptions) {
    this.dataGenerator = options.dataGenerator
    this.endpoint = options.endpoint || '/graphql'
    this.playground = options.playground !== false
  }

  /**
   * 设置 GraphQL
   */
  async setup(app: Express): Promise<void> {
    // 默认 Schema
    const typeDefs = `
      type Query {
        hello: String
        user(id: ID!): User
        users(limit: Int): [User]
      }

      type User {
        id: ID!
        name: String!
        email: String!
        avatar: String
        createdAt: String
      }

      type Mutation {
        createUser(input: CreateUserInput!): User
        updateUser(id: ID!, input: UpdateUserInput!): User
        deleteUser(id: ID!): Boolean
      }

      input CreateUserInput {
        name: String!
        email: String!
      }

      input UpdateUserInput {
        name: String
        email: String
      }
    `

    // 默认 Resolvers
    const resolvers = {
      Query: {
        hello: () => 'Hello from Mock GraphQL Server!',
        user: (_: any, args: { id: string }) => {
          return this.dataGenerator.generate({
            id: args.id,
            name: '@name',
            email: '@email',
            avatar: '@avatar',
            createdAt: '@date',
          })
        },
        users: (_: any, args: { limit?: number }) => {
          const limit = args.limit || 10
          return this.dataGenerator.generateArray(
            {
              id: '@uuid',
              name: '@name',
              email: '@email',
              avatar: '@avatar',
              createdAt: '@date',
            },
            limit
          )
        },
      },
      Mutation: {
        createUser: (_: any, args: { input: any }) => {
          return this.dataGenerator.generate({
            id: '@uuid',
            ...args.input,
            createdAt: '@date',
          })
        },
        updateUser: (_: any, args: { id: string; input: any }) => {
          return this.dataGenerator.generate({
            id: args.id,
            ...args.input,
            updatedAt: '@date',
          })
        },
        deleteUser: () => true,
      },
    }

    // 创建 Schema
    const schema = makeExecutableSchema({
      typeDefs,
      resolvers,
    })

    // 创建 Yoga 实例
    this.yoga = createYoga({
      schema,
      graphqlEndpoint: this.endpoint,
      graphiql: this.playground,
    })

    // 挂载到 Express
    app.use(this.endpoint, this.yoga)

    console.log(`GraphQL server ready at ${this.endpoint}`)
  }

  /**
   * 更新 Schema
   */
  updateSchema(typeDefs: string, resolvers: any): void {
    const schema = makeExecutableSchema({
      typeDefs,
      resolvers,
    })

    this.yoga = createYoga({
      schema,
      graphqlEndpoint: this.endpoint,
      graphiql: this.playground,
    })
  }
}

