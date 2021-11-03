import gql from 'graphql-tag'

export const MY_QUERY = gql`
  query My {
    my {
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
