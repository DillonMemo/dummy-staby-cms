import gql from 'graphql-tag'

export const MY_QUERY = gql`
  query My {
    my {
      _id
      email
      password
      nickname
      profileImageName
      memberStatus
      memberType
      refreshToken
      lastLoginDate
    }
  }
`

export const MEMBER_QUERY = gql`
  query FindMemberById($input: MemberInput!) {
    findMemberById(input: $input) {
      ok
      error {
        ko
        en
      }
      member {
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
