import gql from 'graphql-tag'

/** 로그인 Mutation. */
export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      error
      token
    }
  }
`

export const EDIT_ACCOUNT_MUTATION = gql`
  mutation EditAccount($editUserInput: EditUserInput!) {
    editAccount(input: $editUserInput) {
      ok
      error
    }
  }
`
