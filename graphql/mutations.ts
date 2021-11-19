import gql from 'graphql-tag'

/** 로그인 Mutation. */
export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      error {
        ko
        en
      }
      token
    }
  }
`

export const EDIT_ACCOUNT_MUTATION = gql`
  mutation EditAccount($editMemberInput: EditMemberInput!) {
    editAccount(input: $editMemberInput) {
      ok
      error {
        ko
        en
      }
    }
  }
`

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      ok
      error {
        ko
        en
      }
    }
  }
`

export const MEMBERS_MUTATION = gql`
  mutation Members($membersInput: MembersInput!) {
    members(input: $membersInput) {
      ok
      error {
        ko
        en
      }
      totalResults
      totalPages
      members {
        _id
        email
        nickname
        memberStatus
        memberType
        point {
          totalPoint
          paidPoint
          freePoint
        }
      }
    }
  }
`
