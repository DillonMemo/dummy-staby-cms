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

/** 회원 생성 */
export const CREATE_ACCOUNT_MUTATION = gql`
  mutation CreateAccount($createMemberInput: CreateMemberInput!) {
    createAccount(input: $createMemberInput) {
      ok
      error {
        ko
        en
      }
    }
  }
`

/** 마이페이지 > 수정 Mutation */
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

/** 로그아웃 Mutation */
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

/** Member List Mutation */
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
        nickName
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

/** Edit Member by (_id) */
export const EDIT_MEMBER_BY_ID_MUTATION = gql`
  mutation EditMemberById($editMemberInput: EditMemberInput!) {
    editMemberById(input: $editMemberInput) {
      ok
      error {
        ko
        en
      }
    }
  }
`

/** Create Live */
export const CREATE_LIVE_MUTATION = gql`
  mutation CreateLive($createLiveInput: CreateLiveInput!) {
    createLive(input: $createLiveInput) {
      ok
      error {
        ko
        en
      }
    }
  }
`
