import { gql } from "apollo-server-core";

const typeDefs = gql`
    type Service {
        serviceNumber: String!
        lastMessage: String
        lastStatus: String
        messageCount: Int
        usageCost: Float
    }

    type User {
        _id: ID!
        username: String!
        email: String!
        serviceCount: Int
        key: String,
        msgTemplate: String,
        serviceList: [Service]
    }

    type Auth {
        token: ID!
        user: User
    }

    input ServiceInput {
        serviceNumber: String!
        lastMessage: String
        lastStatus: String
        messageCount: Int
        usageCost: Float
    }

    type Query {
        me: User
    }

    type Mutation {
        addUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        addMsgTemplate(template: String!):User
        saveService(service: ServiceInput!): User
        removeService(serviceNumber: String): User
    }

`

export default typeDefs