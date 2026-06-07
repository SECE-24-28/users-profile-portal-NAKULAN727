import { gql } from '@apollo/client'

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user { id email role student { id firstName lastName } }
    }
  }
`

export const REGISTER = gql`
  mutation Register($email: String!, $password: String!, $role: Role) {
    register(email: $email, password: $password, role: $role) {
      token
      user { id email role }
    }
  }
`

export const ADD_STUDENT = gql`
  mutation AddStudent(
    $firstName: String!, $lastName: String!, $email: String!,
    $phone: String, $dateOfBirth: String, $gender: Gender,
    $address: String, $department: String!, $profileImage: String
  ) {
    addStudent(
      firstName: $firstName, lastName: $lastName, email: $email,
      phone: $phone, dateOfBirth: $dateOfBirth, gender: $gender,
      address: $address, department: $department, profileImage: $profileImage
    ) {
      id firstName lastName email department createdAt
    }
  }
`

export const UPDATE_STUDENT = gql`
  mutation UpdateStudent(
    $id: ID!, $firstName: String, $lastName: String, $email: String,
    $phone: String, $dateOfBirth: String, $gender: Gender,
    $address: String, $department: String, $profileImage: String
  ) {
    updateStudent(
      id: $id, firstName: $firstName, lastName: $lastName, email: $email,
      phone: $phone, dateOfBirth: $dateOfBirth, gender: $gender,
      address: $address, department: $department, profileImage: $profileImage
    ) {
      id firstName lastName email phone dateOfBirth gender address department profileImage updatedAt
    }
  }
`

export const DELETE_STUDENT = gql`
  mutation DeleteStudent($id: ID!) {
    deleteStudent(id: $id)
  }
`

export const UPLOAD_PROFILE_IMAGE = gql`
  mutation UploadProfileImage($studentId: ID!, $imageUrl: String!) {
    uploadProfileImage(studentId: $studentId, imageUrl: $imageUrl) {
      id profileImage
    }
  }
`
