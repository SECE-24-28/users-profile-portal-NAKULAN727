import { gql } from 'graphql-tag'

export const typeDefs = gql`
  enum Role {
    ADMIN
    STUDENT
  }

  enum Gender {
    MALE
    FEMALE
    OTHER
  }

  type User {
    id: ID!
    email: String!
    role: Role!
    createdAt: String!
    student: Student
  }

  type Student {
    id: ID!
    profileImage: String
    firstName: String!
    lastName: String!
    email: String!
    phone: String
    dateOfBirth: String
    gender: Gender
    address: String
    department: String!
    createdAt: String!
    updatedAt: String!
    user: User
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type StudentsResult {
    students: [Student!]!
    total: Int!
    pages: Int!
  }

  type Query {
    getStudents(
      page: Int
      limit: Int
      search: String
      department: String
      gender: String
      sortBy: String
      sortOrder: String
    ): StudentsResult!
    getStudentById(id: ID!): Student
    getCurrentUser: User
  }

  type Mutation {
    register(email: String!, password: String!, role: Role): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    addStudent(
      firstName: String!
      lastName: String!
      email: String!
      phone: String
      dateOfBirth: String
      gender: Gender
      address: String
      department: String!
      profileImage: String
    ): Student!
    updateStudent(
      id: ID!
      firstName: String
      lastName: String
      email: String
      phone: String
      dateOfBirth: String
      gender: Gender
      address: String
      department: String
      profileImage: String
    ): Student!
    deleteStudent(id: ID!): Boolean!
    uploadProfileImage(studentId: ID!, imageUrl: String!): Student!
  }
`
