import gql from 'graphql-tag'

export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      error
      token
    }
  }
`
