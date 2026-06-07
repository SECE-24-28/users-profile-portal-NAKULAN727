import { gql } from '@apollo/client'

export const GET_STUDENTS = gql`
  query GetStudents(
    $page: Int, $limit: Int, $search: String,
    $department: String, $gender: String,
    $sortBy: String, $sortOrder: String
  ) {
    getStudents(
      page: $page, limit: $limit, search: $search,
      department: $department, gender: $gender,
      sortBy: $sortBy, sortOrder: $sortOrder
    ) {
      students {
        id profileImage firstName lastName email
        phone department gender createdAt
      }
      total pages
    }
  }
`

export const GET_STUDENT_BY_ID = gql`
  query GetStudentById($id: ID!) {
    getStudentById(id: $id) {
      id profileImage firstName lastName email phone
      dateOfBirth gender address department createdAt updatedAt
      user { id email role }
    }
  }
`

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      id email role createdAt
      student { id firstName lastName profileImage department }
    }
  }
`
